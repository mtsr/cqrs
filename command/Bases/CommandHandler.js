var async = require('async');
var _ = require('lodash');

var Base = require('./Base');

var CommandHandler = Base.extend({
    constructor: function(eventStore) {
        this.eventStore = eventStore;
    },

    handle: function(aggregateType, aggregateID, command, data, callback) {
        console.log('CommandHandler.handle', aggregateType, aggregateID, command, data);
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
        ], function(err) {
            if (err) {
                return callback(err);
                // throw err;
            }
            callback(null);
        });
    },

    loadAggregate: function(aggregateType, aggregateID, callback) {
        console.log('CommandHandler.loadAggregate');
        // TODO preload aggregates
        var Aggregate = require('../Aggregates/'+aggregateType);
        var aggregate = new Aggregate(aggregateID);
        this.eventStore.getFromSnapshot(aggregateID, function(err, snapshot, stream) {
            async.map(stream.events, function(evt, next) {
                next(null, evt.payload);
            }, function(err, events) {
                aggregate.loadFromHistory(snapshot.data, events);
                callback(null, aggregate, stream);
            });
        });
    },

    commit: function(aggregate, eventStream, command, data, callback) {
        console.log('CommandHandler.commit');
        _.forEach(aggregate.uncommittedEvents, function(event) {
            eventStream.addEvent(event);
        });
        eventStream.commit(callback);
    },
});

module.exports = CommandHandler;
