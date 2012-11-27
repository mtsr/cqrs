var async = require('async');

var Base = require('./Base');

var Projection = Base.extend({
    constructor: function() {
        this.collections = {};
        this.events = {};
    },

    initialize: function(database, callback) {
        var self = this;
        this.database = database;

        async.forEach(Object.keys(this.collections), function(collectionName, next) {
            database.createCollection(self.projectionName+'.'+collectionName, {}, function(err, collection) {
                if (err) {
                    return next(err);
                }

                self.collections[collectionName] = collection;
                next();
            });
        }, function(err) {
            callback(err);
        });
    },

    handle: function(event) {
        this[event.event](event);
    }
});

module.exports = Projection;
