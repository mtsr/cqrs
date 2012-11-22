var _ = require('lodash');

var Projection = require('../Bases/Projection');

var Chat = Projection.extend({
    constructor: function() {
        Chat.__super__.constructor.apply(this, arguments);
        this.projectionName = 'Chat';
    },

    initialize: function(collection) {
        this.collection = collection;
    },

    events: {
        Chat: [
            'chatStarted',
            'messageSent'
        ]
    },

    chatStarted: function(event) {
        console.log('Chat started', event);
        var doc = { aggregateID: event.aggregateID };
        _.extend(doc, event.data);
        this.collection.insert(doc, { safe: true }, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    },
    messageSent: function(event) {
        console.log('Name changed', event);
        this.collection.update({ aggregateID: event.aggregateID }, { $push: { messages: event.data }}, { safe: true }, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    }
});

module.exports = Chat;