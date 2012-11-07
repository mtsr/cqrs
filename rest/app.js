var express = require('express');
var http = require('http');

var amqp = require('amqp');

var app = express();

var requestId = 0;
var replyQueue = [];

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
});

var connection = amqp.createConnection();
connection.on('ready', function() {
    var exchange = connection.exchange('command', { type: 'direct' }, function(exchange) {
        console.log('Exchange is open:', arguments);
    });
    console.log('Exchange:', exchange);

    app.post('*', function(req, res) {
        console.log('POST');
        replyQueue[requestId] = res;
        exchange.publish('command', { command: req.url }, { replyTo: 'rest', correlationId: requestId.toString() }, function() {
            console.log('Publish callback:', arguments);
        });
        requestId++;
    });

    app.get('*', function(req, res) {
        console.log('GET');
        replyQueue[requestId] = res;
        exchange.publish('command', { query: req.url }, { replyTo: 'rest', correlationId: requestId.toString() }, function() {
            console.log('Publish callback:', arguments);
        });
        requestId++;
    });

    app.put('*', function(req, res) {
    });

    app.delete('*', function(req, res) {
    });

    connection.queue('rest', function(queue) {
        queue.bind('rest', 'rest');
        console.log('Queue is open:', arguments);

        queue.subscribe(function(message, headers, deliveryInfo) {
            console.log('Message from queue:', arguments);
            if (replyQueue[deliveryInfo.correlationId]) {
                replyQueue[deliveryInfo.correlationId].send(message);
            } else {
                console.log('ERROR: CorrelationId', deliveryInfo.correlationId, 'not in reply queue');
            }
        });
    });

    process.on('SIGINT', function() {
        exchange.destroy();
        connection.end();
    });

    http.createServer(app).listen(app.get('port'), function() {
            console.log('Express server listening on port', app.get('port'));
    });
});

