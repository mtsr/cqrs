var express = require('express');
var http = require('http');

var _ = require('underscore');

var commandHandler = require('./CommandHandler');

var app = express();

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

commandHandler.init(function(err) {
    app.post('/:aggregate/:aggregateID/:command', function(req, res) {
        console.log('POST', req.url);

        var commandData = {
            // because req.params is an [] not an {} properties are lost upon JSONify
            // solved by copying the properties to an {}
            params: _.extend({}, req.params),
            query: req.query,
            data: req.body,
            // headers: req.headers
        };

        commandHandler.handle(commandData, function(err, response) {
            console.log('CommandHandler Result');
            res.send(response);
        });
    });

    app.get('*', function(req, res) {
    });

    app.put('*', function(req, res) {
    });

    app.delete('*', function(req, res) {
    });

    http.createServer(app).listen(app.get('port'), function() {
            console.log('Express server listening on port', app.get('port'));
    });
});
