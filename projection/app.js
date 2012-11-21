var amqp = require('amqp');

var connection = amqp.createConnection();
connection.on('ready', function() {
    connection.queue('projection', function(queue) {
        queue.subscribe(function(message, headers, deliveryInfo) {
            console.log(arguments);
        });

        // console.log('Queue is open:', arguments);
        queue.bind_headers('event', { 'x-match': 'all', aggregateType: 'User' });
    });

    process.on('SIGINT', function() {
        connection.end();
    });
});
