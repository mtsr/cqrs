var express = require('express');
var http = require('http');

var amqp = require('amqp');

var app = express();

var cid = 0;
var qid = 0;

var commandReplyQueue = [];
var queryReplyQueue = [];

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
        commandReplyQueue[cid] = res;
        exchange.publish('command', { command: req.url, cid: cid++ }, { replyTo: 'rest' }, function() {
            console.log('Publish callback:', arguments);
        });
    });

    app.get('*', function(req, res) {
        queryReplyQueue[qid] = res;
        exchange.publish('command', { query: req.url, qid: qid++ }, { replyTo: 'rest' }, function() {
            console.log('Publish callback:', arguments);
        });
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
            if (message.cid !== undefined && message.cid !== null) {
                commandReplyQueue[message.cid].send(message);
            } else if (message.qid !== undefined && message.qid !== null) {
                queryReplyQueue[message.qid].send(message);
            } else {
                throw "Unknown message type";
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

