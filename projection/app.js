var fs = require('fs');
var path = require('path');
var amqp = require('amqp');
var async = require('async');
var _ = require('lodash');

var projections = {};
var projectionsPath = './Projections';

var events = {};

async.waterfall([
    function(callback) {
        fs.readdir(projectionsPath, callback);
    },
    function(files, callback) {
        var jsFiles = _.filter(files, function(file) {
            return path.extname(file) === '.js';
        });

        async.forEach(jsFiles, function(file, callback) {
            var Projection = require(path.join(__dirname, projectionsPath, file));
            var projection = new Projection();

            // Don't load a projection with the same name twice
            if (projections[projection.projectionName]) {
                return callback('Projection', projection.projectionName, 'already loaded');
            }
            projections[projection.projectionName] = projection;

            _.forEach(projection.events, function(projectionEvents, aggregateType) {
                events[aggregateType] = events[aggregateType] || {};
                _.forEach(projectionEvents, function(eventName) {
                    events[aggregateType][eventName] = events[aggregateType][eventName] || [];
                    events[aggregateType][eventName].push(projection);
                });
            });

            callback();
        }, function(err) {
            callback(err);
        });
    },
    function(callback) {
        var connection = amqp.createConnection();
        connection.on('ready', function() {
            connection.queue('projection', { durable: true, autoDelete: false }, function(queue) {
                queue.subscribe({ ack: true, prefetchCount: 5 }, function(message, headers, deliveryInfo) {
                    console.log(message);
                    async.forEach(events[message.aggregateType][message.event], function(projection, next) {
                        projection[message.event](message);
                    }, function(err) {
                        if (err) {
                            return callback(err);
                        }
                        queue.shift();
                    });
                });

                // console.log('Queue is open:', arguments);
                queue.bind('event', '');
                // queue.bind_headers('event', { 'x-match': 'all', aggregateType: 'User' });
            });

            process.on('SIGINT', function() {
                connection.end();
            });

            callback();
        });
    }
], function(err) {
    if (err) {
        throw err;
    }
});
