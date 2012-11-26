var fs = require('fs');
var path = require('path');
var amqp = require('amqp');
var async = require('async');
var _ = require('lodash');
var mongo = require('mongodb');

var projections = {};
var projectionsPath = './Projections';

var events = {};

async.waterfall([
    function(callback) {
        var server = new mongo.Server('localhost', 27017, { autoreconnect: true });
        var database = new mongo.Db('projections', server);
        database.open(function(err, mongodb) {
            if (err) {
                return callback(err);
            }
            callback(null, mongodb);
        });
    },
    function(mongodb, callback) {
        fs.readdir(projectionsPath, function(err, files) { callback(err, files, mongodb); });
    },
    function(files, mongodb, callback) {
        var jsFiles = _.filter(files, function(file) {
            return path.extname(file) === '.js';
        });

        async.forEach(jsFiles, function(file, callback) {
            var Projection = require(path.join(__dirname, projectionsPath, file));
            var projection = new Projection();

            // create or open mongodb collection
            mongodb.createCollection(projection.projectionName, {}, function(err, collection) {
                if (err) {
                    return callback(err);
                }

                projection.initialize(collection);

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
            });
        }, function(err) {
            callback(err);
        });
    },
    function(callback) {
        var connection = amqp.createConnection();
        connection.on('ready', function() {
            connection.queue('projection', { durable: true, autoDelete: false }, function(queue) {
                queue.subscribe({ ack: true, prefetchCount: 5 }, function(payload, headers, deliveryInfo, message) {
                    console.log(payload);
                    if (!payload.aggregateType ||
                        !payload.event ||
                        !events[payload.aggregateType] ||
                        !events[payload.aggregateType][payload.event]
                    ) {
                        return message.acknowledge();
                    }

                    async.forEach(events[payload.aggregateType][payload.event], function(projection, next) {
                        projection[payload.event](payload);
                        next();
                    }, function(err) {
                        if (err) {
                            console.log(err);
                            return callback(err);
                        }
                        message.acknowledge();
                    });
                });

                // console.log('Queue is open:', arguments);
                queue.bind('event', ''); // routing key is ignored for fanout exchanges
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
        console.log(err);
        throw err;
    }
});
