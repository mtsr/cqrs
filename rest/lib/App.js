"use strict";

var express = require('express');
var http = require('http');
var util = require('util');
var _ = require('lodash');
var mongodb = require('mongodb');
var async = require('async');

var CommandHandler = require('./CommandHandler');

var App = function() {

};

App.prototype.start = function(ready) {
  var app = setupExpress();

  async.auto({
    'commandHandler': [function(done, results) {
      var commandHandler = new CommandHandler();
      commandHandler.init(function(err) {
        done(err, commandHandler);
      });
    }],
    'database': [function(done, results) {
      var server = new mongodb.Server('localhost', 27017, { autoreconnect: true });
      var database = new mongodb.Db('projections', server, { safe: true });
      database.open(done);
    }],
    'post': ['commandHandler', function(done, results) {
      var commandHandler = results.commandHandler;
      app.post('/:aggregate/:aggregateID/:command', function(req, res) {

        console.log('POST', req.url, req.headers);

        var commandData = {
          // because req.params is an [] not an {} properties are lost upon JSONify
          // solved by copying the properties to an {}
          params: _.extend({}, req.params),
          query: req.query,
          data: req.body,
          // headers: req.headers
        };

        commandHandler.handle(commandData, function(err, response) {
          console.log('CommandHandler response');
          if (err) {
            console.log(err);
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.set('Access-Control-Allow-Headers', 'origin, content-type, accept');
            res.set('Access-Control-Allow-Credentials', 'true');
            return res.send(500, err);
          }
          res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
          res.set('Access-Control-Allow-Headers', 'origin, content-type, accept');
          res.set('Access-Control-Allow-Credentials', 'true');
          res.send(200, response);
        });
      });
      done();
    }],
    'get': ['database', function(done, results) {
      var database = results.database;
      app.get('/:collection', function(req, res) {
        console.log("Cookies:", req.cookies);
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.set('Access-Control-Allow-Credentials', 'true');

        database.collection(req.params.collection+'.main', { safe: true }, function(err, collection) {
          if (err) {
            console.log(err);
            return res.send(err);
          }

          console.log('Query:', req.query);
          var cursor = collection.find(req.query);

          if ('skip' in req.query) {
            var skip = parseInt(req.query.skip);
            cursor = cursor.skip(skip);
          }
          if ('limit' in req.query) {
            var limit = parseInt(req.query.limit);
            cursor = cursor.limit(limit);
          }
          if ('count' in req.query) {
            cursor.count(function(err, count) {
              if (err) {
                res.send(500, err);
              }
              res.send(200, ""+count);
            });
            return;
          }

          cursor.toArray(function(err, items) {
            if (err) {
              return res.send(500, err);
            }
            res.send(200, items);
          });
        });
      });
      done();
    }],
    'options': [function(done, results) {
      app.options('*', function(req, res) {
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.set('Access-Control-Allow-Credentials', 'true');
        console.log('OPTIONS', req.url, req.headers);
        res.send(200);
      });
      done();
    }],
    'server': ['post', 'get', 'options', function(done, results) {
      http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port', app.get('port'));
        done();
      });
    }],
  }, function(err, results) {
    ready && typeof ready === 'function' && ready();
  });
};

var setupExpress = function() {
  var app = express();

  app.configure(function() {
    app.set('port', process.env.PORT || 3001);
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

  return app;
};

module.exports = App;
