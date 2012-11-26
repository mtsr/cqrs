var amqp = require('amqp');

var EventStore = require('eventstore');
var EventStorage = require('eventstore.mongoDb');

var Domain = require('./Domain');
var Publisher = require('./Publisher');

var connection = amqp.createConnection();
connection.on('ready', function() {
    var commandExchange = connection.exchange('command', { type: 'direct', confirm: true }, function(exchange) {
        console.log('Command exchange is open');
    });

    var eventExchange = connection.exchange('event', { type: 'fanout', confirm: true }, function(exchange) {
        console.log('Event exchange is open');
    });

    var publisher = new Publisher(eventExchange);
    var eventStore = EventStore.createStore({ logger: 'console' });
    EventStorage.createStorage(function(err, eventStorage) {
        if (err) {
            throw err;
        }
        console.log('EventStorage created');
        eventStore.configure(function() {
            eventStore.use(eventStorage);
            eventStore.use(publisher); // your publisher must provide function 'publisher.publish(event)'
        });

        // start EventStore
        eventStore.start();

        var domain = new Domain(eventStore);

        connection.queue('command', { durable: true, autoDelete: false }, function(queue) {
            // console.log('Queue is open:', arguments);

            queue.subscribe({ ack: true, prefectCount: 5 }, function(payload, headers, deliveryInfo, message) {
                receiveMessage(commandExchange, queue, domain, payload, headers, deliveryInfo, message);
            });

            queue.bind('command', 'command');
        });
    });

    process.on('SIGINT', function() {
        connection.end();
    });
});

var receiveMessage = function(commandExchange, queue, domain, payload, headers, deliveryInfo, message) {
    console.log('Message from queue:', payload);

    domain.handle(
        payload.params.aggregate,
        payload.params.aggregateID,
        payload.params.command,
        payload.data,
        function(err, response) {
            sendResponse(commandExchange, err, response, deliveryInfo);
            message.acknowledge();
        }
    );
}

var sendResponse = function(commandExchange, err, response, deliveryInfo) {
    var responseData = { error: err, response: response };
    var messageData = { correlationId: deliveryInfo.correlationId };
    console.log('RESPONSE', deliveryInfo.replyTo, responseData, messageData);
    commandExchange.publish(deliveryInfo.replyTo, responseData, messageData, function() {
        console.log('Publish callback:', arguments);
    });
};
