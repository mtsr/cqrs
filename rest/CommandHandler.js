var amqp = require('amqp');

var CommandHandler = function() {
    this.requestID = 0;
    this.replyQueue = [];

    this.exchange = null;
}

CommandHandler.prototype.init = function(ready) {
    var self = this;

    var connection = amqp.createConnection();
    connection.on('ready', function() {
        self.exchange = connection.exchange('command', { type: 'direct' }, function(exchange) {
            // console.log('Exchange is open:', arguments);
        });
        // console.log('Exchange:', exchange);

        connection.queue('rest', function(queue) {
            queue.bind('command', 'rest');
            // console.log('Queue is open:', arguments);

            queue.subscribe(function(message, headers, deliveryInfo) {
                console.log('Message from queue:', message, headers, deliveryInfo);
                var callback = self.replyQueue[deliveryInfo.correlationId];
                if (callback) {
                    callback(message.error, message.response);
                } else {
                    console.log('ERROR: CorrelationId', deliveryInfo.correlationId, 'not in reply queue');
                }
            });
        });

        process.on('SIGINT', function() {
            exchange.destroy();
            connection.end();
        });

        ready(null);
    });
};

CommandHandler.prototype.handle = function(commandData, callback) {
    this.replyQueue[this.requestID] = callback;

    var messageData = {
        replyTo: 'rest',
        correlationId: this.requestID.toString()
    };

    this.exchange.publish('command', commandData, messageData, function() {
        console.log('Publish callback:', arguments);
    });
    this.requestID++;
}

module.exports = new CommandHandler();