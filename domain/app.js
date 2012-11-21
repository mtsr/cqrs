var util = require('util');
var amqp = require('amqp');
var async = require('async');
var _ = require('lodash');

var domain = require('cqrs-domain').domain;

var Publisher = require('./Publisher');

async.waterfall([
    function(next) {
        // domain.on('event', function(event) {
        //     console.log('domain event', event);
        // });

        domain.on('*', function(event) {
            console.log('domain event', event);
        });

        domain.initialize({
            commandHandlersPath: __dirname + '/commandHandlers',
            aggregatesPath: __dirname + '/aggregates',
            sagaHandlersPath: __dirname + '/sagaHandlers',  // optional, only if using sagas
            sagasPath: __dirname + '/sagas',                // optional, only if using sagas
            publishingInterval: 20,                         // optional
            snapshotThreshold: 10,                          // optional

            commandQueue: {                                 // optional
                type: 'mongoDb',                            // example with mongoDb
                dbName: 'domain',
                collectionName: 'commands',                 // optional
                host: '127.0.0.1',                          // optional
                port: 27017,                                // optional
                // username: 'user',                           // optional
                // password: 'pwd'                             // optional
            },
            repository: {                                   // optional
                type: 'mongoDb',                            // example with mongoDb
                dbName: 'domain',
                collectionName: 'sagas',                    // optional
                host: '127.0.0.1',                          // optional
                port: 27017,                                // optional
                // username: 'user',                           // optional
                // password: 'pwd'                             // optional
            },
            eventStore: {                                   // optional
                type: 'mongoDb',                            // example with mongoDb
                dbName: 'domain',
                eventsCollectionName: 'events',             // optional
                snapshotsCollectionName: 'snapshots',       // optional
                host: '127.0.0.1',                          // optional
                port: 27017,                                // optional
                // username: 'user',                           // optional
                // password: 'pwd'                             // optional
            }
        }, function(err) {
            console.log('domain.initialize() done')

            next(err, domain);
        });
    },
    function(domain, next) {
        var connection = amqp.createConnection();
        connection.on('ready', function() {
            var exchange = connection.exchange('rest', { type: 'direct' }, function(exchange) {
                // console.log('Exchange is open:', arguments);
            });

            connection.queue('command', function(queue) {
                queue.bind('command', 'command');
                // console.log('Queue is open:', arguments);

                queue.subscribe(function(message, headers, deliveryInfo) {
                    console.log('Message:', message);
                    // receiveMessage(exchange, commandHandler, message, headers, deliveryInfo);
                    var command = {
                        command: message.params.command,
                    };
                    var payload = message.data || {};
                    payload.id = message.params.aggregateID;
                    command.payload = payload;
                    command.id = message.params.commandID;

                    domain.handle(command, function(err) {
                        if (err) {
                            sendResponse(exchange, deliveryInfo, err);
                            // throw err;
                            return;
                        }
                        console.log('domain.handle() done');
                        sendResponse(exchange, deliveryInfo, err, 'ACK');
                    });
                });
            });

            process.on('SIGINT', function() {
                exchange.destroy();
                connection.end();
            });

            next();
        });
    }],
    function(err) {
        if (err) {
            throw err;
        }
        console.log('App ready!');
    }
);

var sendResponse = function(exchange, deliveryInfo, err, response) {
    if (err) {
        console.log('Send response received error:', err);
    }

    var responseData = { err: util.inspect(err), response: response };
    console.log('RESPONSE', responseData);
    var messageData = { correlationId: deliveryInfo.correlationId };
    exchange.publish(deliveryInfo.replyTo, responseData, messageData, function() {
        console.log('Publish callback:', arguments);
    });
};
