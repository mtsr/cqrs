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
    var eventStore = EventStore.createStore();
    EventStorage.createStorage(function(err, eventStorage) {
        if (err) {
            throw err;
        }
        console.log('EventStorage created');
        eventStore.configure(function() {
            eventStore.use(eventStorage);
            eventStore.use(publisher); // your publisher must provide function 'publisher.publish(event)'
            eventStore.use({ logger: 'console' });
        });

        // start EventStore
        eventStore.start();
    });
    var domain = new Domain(eventStore);

    connection.queue('command', { durable: true, autoDelete: false }, function(queue) {
        // console.log('Queue is open:', arguments);

        queue.subscribe({ ack: true, prefectCount: 5 }, function(message, headers, deliveryInfo) {
            receiveMessage(commandExchange, queue, domain, message, headers, deliveryInfo);
        });

        queue.bind('command', 'command');
    });

    process.on('SIGINT', function() {
        connection.end();
    });
});

var receiveMessage = function(commandExchange, queue, domain, message, headers, deliveryInfo) {
    console.log('Message from queue:', message);

    domain.handle(
        message.params.aggregate,
        message.params.aggregateID,
        message.params.command,
        message.data,
        function(err, response) {
            sendResponse(commandExchange, err, response, deliveryInfo);
            queue.shift();
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
