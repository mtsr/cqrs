var _ = require('lodash');

var Projection = require('../Bases/Projection');

var Messages = Projection.extend({
    constructor: function() {
        Messages.__super__.constructor.apply(this, arguments);
        this.projectionName = 'Messages';
    },

    initialize: function(collection) {
        this.collection = collection;
    },

    events: {
        Chat: [
            'messageSent'
        ]
    },

    messageSent: function(event) {
        console.log('Message sent', event);
        var document = { chatID: event.aggregateID };
        _.extend(document, event.data);
        this.collection.insert(document, { safe: true }, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    }
});

module.exports = Messages;