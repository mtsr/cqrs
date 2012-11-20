var async = require('async');

var Base = require('./Base');

var CommandHandler = Base.extend({
    constructor: function(eventStore) {
        this.eventStore = eventStore;
    },

    handle: function(aggregate, aggregateID, command, data, callback) {
        var self = this;

        async.waterfall([
            function(next) {
                self.loadAggregate(aggregate, aggregateID, next);
            },
        ], function(err) {
            if (err) {
                throw err;
            }
            var response = { aggregate: aggregate, aggregateID: aggregateID, command: command };
            console.log(response);
            callback(null, response);
        });
    },

    loadAggregate: function(aggregate, aggregateID, callback) {
        // TODO preload aggregates
        var Aggregate = require('../Aggregates/'+aggregate);
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

    commit: function() {
        this.eventStore.getEventStream(aggregateID, 0, function(err, eventStream) {
            console.log('EventStream gotten', eventStream.events);
            eventStream.addEvent({ command: command });
            eventStream.commit();
        });

    }
});

module.exports = CommandHandler;
