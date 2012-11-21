var amqp = require('amqp');

var EventStore = require('eventstore');
var EventStorage = require('eventstore.mongoDb');

var CommandHandler = require('./Bases/CommandHandler');
var Publisher = require('./Publisher');

var connection = amqp.createConnection();
connection.on('ready', function() {
    var exchange = connection.exchange('rest', { type: 'direct' }, function(exchange) {
        // console.log('Exchange is open:', arguments);
    });

    var publisher = new Publisher(exchange);
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
    var commandHandler = new CommandHandler(eventStore);

    connection.queue('command', function(queue) {
        queue.bind('command', 'command');
        // console.log('Queue is open:', arguments);

        queue.subscribe(function(message, headers, deliveryInfo) {
            receiveMessage(exchange, commandHandler, message, headers, deliveryInfo);
        });
    });

    process.on('SIGINT', function() {
        exchange.destroy();
        connection.end();
    });
});

var receiveMessage = function(exchange, commandHandler, message, headers, deliveryInfo) {
    console.log('Message from queue:', arguments);

    commandHandler.handle(
        message.params.aggregate,
        message.params.aggregateID,
        message.params.command,
        message.body,
        function(err, response) { sendResponse(exchange, err, response, deliveryInfo); }
    );
}

var sendResponse = function(exchange, err, response, deliveryInfo) {
    var responseData = { error: err, response: response };
    var messageData = { correlationId: deliveryInfo.correlationId };
    console.log('RESPONSE', responseData, messageData);
    exchange.publish(deliveryInfo.replyTo, responseData, messageData, function() {
        console.log('Publish callback:', arguments);
    });
};
