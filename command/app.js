var amqp = require('amqp');

var command = require('./CommandRouter');

var connection = amqp.createConnection();
connection.on('ready', function() {
    var exchange = connection.exchange('rest', { type: 'direct' }, function(exchange) {
        console.log('Exchange is open:', arguments);
    });

    connection.queue('command', function(queue) {
        queue.bind('command', 'command');
        console.log('Queue is open:', arguments);

        queue.subscribe(function(message, headers, deliveryInfo) {
            console.log('Message from queue:', arguments);
            exchange.publish(deliveryInfo.replyTo, { response: message }, { correlationId: deliveryInfo.correlationId }, function() {
                console.log('Publish callback:', arguments);
            });
        });
    });

    process.on('SIGINT', function() {
        exchange.destroy();
        connection.end();
    });
});
