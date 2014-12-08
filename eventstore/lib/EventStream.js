"use strict";

var mongodb = require('mongodb');

var EventStream = function(streamId, options) {
  this.streamId = streamId; // GUID

  this.streamRevision = null;
  this.commitSequence = null;

  this.committedEvents = [];
  this.committedHeaders = {};

  this.uncommittedEvents = [];
  this.uncommittedHeaders = {};

  this.load(options);
};

EventStream.load(options) {
  options = options || {};
  _(options).defaults({
    minRevision: null,
    maxRevision: null,
  });


};

EventStream.add(uncommittedEvent) {

};

EventStream.commitChanges(commitId) {

};

EventStream.clearChanges() {

};

module.exports = EventStream;