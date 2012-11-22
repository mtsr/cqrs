var express = require('express');
var http = require('http');
var _ = require('lodash');
var mongodb = require('mongodb');

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
            if (err) {
                return res.send(500, err);
            }
            res.send(200, response);
        });
    });
});

var server = new mongodb.Server('localhost', 27017, { autoreconnect: true });
var database = new mongodb.Db('projections', server);
database.open(function(err, mongodb) {
    if (err) {
        return res.send(err);
    }
    app.get('/:collection', function(req, res) {
        console.log(req.query);
        var query = req.query.query?JSON.parse(req.query.query):null;
        mongodb.collection(req.params.collection, { safe: true }, function(err, collection) {
            if (err) {
                return res.send(err);
            }

            var cursor = collection.find(query);
            // console.log(typeof req.query.skip);

            var skip = parseInt(req.query.skip);
            if (skip) {
                cursor = cursor.skip(skip);
            }
            var limit = parseInt(req.query.limit);
            if (limit) {
                cursor = cursor.limit(limit);
            }

            cursor.toArray(function(err, items) {
                if (err) {
                    return res.send(500, err);
                }
                res.send(items);
            });
        });
    });
});

    // app.put('*', function(req, res) {
    // });

    // app.delete('*', function(req, res) {
    // });

http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port', app.get('port'));
});
