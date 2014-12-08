"use strict";

var MongoStorage = require('./MongoStorage');

var EventStore = function(options) {
  this.ready = false;
};

EventStore.initialize(readyCallback) {
  var mongoStorage = new MongoStorage();
  mongoStorage.initialize(function(err, results) {
    if (err) {
      return callback(err);
    }

    this.ready = true;
    this.streams = results.streams;
    this.commits = results.commits;
  }.bind(this));
};

EventStore.getStream = function(streamId, options) {
  var eventStream = new EventStream(streamId, options);
  return eventStream;
};

module.exports = EventStore;