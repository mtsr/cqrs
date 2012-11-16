var amqp = require('amqp');

var commandHandler = require('./CommandHandler');

var exchange = null;

var connection = amqp.createConnection();
connection.on('ready', function() {
    exchange = connection.exchange('rest', { type: 'direct' }, function(exchange) {
        // console.log('Exchange is open:', arguments);
    });

    connection.queue('command', function(queue) {
        queue.bind('command', 'command');
        // console.log('Queue is open:', arguments);

        queue.subscribe(function(message, headers, deliveryInfo) {
            receiveMessage(message, headers, deliveryInfo);
        });
    });

    process.on('SIGINT', function() {
        exchange.destroy();
        connection.end();
    });
});

var receiveMessage = function(message, headers, deliveryInfo) {
    console.log('Message from queue:', arguments);

    commandHandler.handle(
        message.params.aggregate,
        message.params.aggregateID,
        message.params.command,
        message.body,
        function(err, response) { sendResponse(err, response, deliveryInfo); }
    );
}

var sendResponse = function(err, response, deliveryInfo) {
    console.log('RESPONSE', response);

    var responseData = { response: response };
    var messageData = { correlationId: deliveryInfo.correlationId };
    exchange.publish(deliveryInfo.replyTo, responseData, messageData, function() {
        console.log('Publish callback:', arguments);
    });
};
