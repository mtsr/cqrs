var _ = require('lodash');

var Projection = require('../Bases/Projection');

var User = Projection.extend({
    constructor: function() {
        User.__super__.constructor.apply(this, arguments);
        this.projectionName = 'User';
    },

    initialize: function(collection) {
        this.collection = collection;
    },

    events: {
        User: [
            'userRegistered',
            'nameChanged'
        ]
    },

    userRegistered: function(event) {
        console.log('User registered', event);
        var doc = { aggregateID: event.aggregateID };
        _.extend(doc, event.data);
        this.collection.insert(doc, { safe: true }, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    },
    nameChanged: function(event) {
        console.log('Name changed', event);
        this.collection.update({ aggregateID: event.aggregateID }, { $set: event.data }, { safe: true }, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    }
});

module.exports = User;