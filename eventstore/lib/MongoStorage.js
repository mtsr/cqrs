"use strict";

var mongodb = require('mongodb');
var async = require('async');

var MongoStorage = function() {

};

MongoStorage.initialize(readyCallback) {
  var server = new mongodb.Server('localhost', 27017, { autoreconnect: true });
  var database = new mongodb.Db('eventstore_test', server, { safe: true });

  async.auto({
    'connection': [function(done) {
      database.open(done);
    }],
    'streams': ['connection', function(done, results) {
      results.connection.collection('streams', { safe: true }, done);
    }],
    'commits': ['connection', function(done, results) {
      results.connection.collection('commits', { safe: true }, done);
    }],
  }, function(err, results) {
    readyCallback(err, {
      streams: results.streams,
      commits: results.commits,
    });
  });
};

