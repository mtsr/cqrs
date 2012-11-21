var util = require('util');
var async = require('async');
var _ = require('lodash');

var Base = require('./Bases/Base');

var Domain = Base.extend({
    constructor: function(eventStore) {
        this.eventStore = eventStore;
    },

    handle: function(aggregateType, aggregateID, command, data, callback) {
        console.log('Domain.handle:', aggregateType, aggregateID, command, data);
        var self = this;

        async.waterfall([
            function(next) {
                self.loadAggregate(aggregateType, aggregateID, next);
            },
            function(aggregate, stream, next) {
                aggregate[command](data, function(err) {
                    next(err, aggregate, stream);
                });
            },
            function(aggregate, stream, next) {
                self.commit(aggregate, stream, command, data, next);
            }
        ], function(err, response) {
            if (err) {
                return callback(err);
                // throw err;
            }
            callback(null, response);
        });
    },

    loadAggregate: function(aggregateType, aggregateID, callback) {
        console.log('Domain.loadAggregate:', aggregateType, aggregateID);
        // TODO preload aggregates
        var Aggregate = require('./Aggregates/'+aggregateType);
        var aggregate = new Aggregate(aggregateID);
        this.eventStore.getFromSnapshot(aggregateID, function(err, snapshot, stream) {
            aggregate.loadFromHistory(snapshot.data, stream.events);
            callback(null, aggregate, stream);
        });
    },

    commit: function(aggregate, eventStream, command, data, callback) {
        var events = aggregate.uncommittedEvents;
        console.log('Domain.commit:', events.length, 'events');

        _.forEach(events, function(event) {
            eventStream.addEvent(event);
        });

        eventStream.commit(function(err) {
            if (err) {
                return callback(err);
            }
            callback(err, events);
        });
    },
});

module.exports = Domain;