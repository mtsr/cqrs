var amqp = require('amqp');

var command = require('./CommandRouter');

var connection = amqp.createConnection();
connection.on('ready', function() {
    var exchange = connection.exchange('rest', { type: 'direct' }, function(exchange) {
        // console.log('Exchange is open:', arguments);
    });

    connection.queue('command', function(queue) {
        queue.bind('command', 'command');
        // console.log('Queue is open:', arguments);

        queue.subscribe(function(message, headers, deliveryInfo) {
            console.log('Message from queue:', arguments);

            var response = command.handle(message.params.aggregate, message.params.aggregateID, message.params.command, message.body);
            console.log('RESPONSE', response);

            var responseData = { response: response };
            var messageData = { correlationId: deliveryInfo.correlationId };
            exchange.publish(deliveryInfo.replyTo, responseData, messageData, function() {
                console.log('Publish callback:', arguments);
            });
        });
    });

    process.on('SIGINT', function() {
        exchange.destroy();
        connection.end();
    });
});
