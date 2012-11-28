var fs = require('fs');
var path = require('path');
var amqp = require('amqp');
var async = require('async');
var _ = require('lodash');
var mongodb = require('mongodb');

var projections = {};
var projectionsPath = './Projections';

var events = {};

async.waterfall([
    function(callback) {
        initDatabase(callback);
    },
    function(database, callback) {
        fs.readdir(projectionsPath, function(err, files) { callback(err, files, database); });
    },
    function(files, database, callback) {
        loadProjections(files, database, callback);
    },
    function(callback) {
        connectAMQP(handleMessage, callback);
    }
], function(err) {
    if (err) {
        console.log(err);
        throw err;
    }
});

var handleMessage = function(payload, headers, deliveryInfo, message) {
    console.log(payload);
    if (!payload.aggregateType ||
        !payload.event ||
        !events[payload.aggregateType] ||
        !events[payload.aggregateType][payload.event]
    ) {
        return message.acknowledge();
    }

    async.forEach(events[payload.aggregateType][payload.event], function(projection, next) {
        projection.handle(payload);
        next();
    }, function(err) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        message.acknowledge();
    });
};

var initDatabase = function(callback) {
    var server = new mongodb.Server('localhost', 27017, { autoreconnect: true });
    var database = new mongodb.Db('projections', server);
    database.open(function(err, database) {
        if (err) {
            return callback(err);
        }
        callback(null, database);
    });
};

var loadProjections = function(files, database, callback) {
    var jsFiles = _.filter(files, function(file) {
        return path.extname(file) === '.js';
    });

    async.forEach(jsFiles, function(file, callback) { loadProjection(file, database, callback); }, function(err) {
        callback(err);
    });
};

var loadProjection = function(file, database, callback) {
    var Projection = require(path.join(__dirname, projectionsPath, file));
    var projection = new Projection();

    projection.initialize(database, function(err) {
        _.forEach(projection.events, function(projectionEvents, aggregateType) {
            events[aggregateType] = events[aggregateType] || {};
            _.forEach(projectionEvents, function(eventName) {
                events[aggregateType][eventName] = events[aggregateType][eventName] || [];
                events[aggregateType][eventName].push(projection);
            });
        });
        callback(err);
    });
};

var connectAMQP = function(messageHandler, callback) {
    var connection = amqp.createConnection();
    connection.on('ready', function() {
        connection.queue('projection', { durable: true, autoDelete: false }, function(queue) {
            queue.subscribe({ ack: true, prefetchCount: 5 }, function(payload, headers, deliveryInfo, message) {
                messageHandler(payload, headers, deliveryInfo, message);
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
};
