var Projection = require('../Bases/Projection');

var User = Projection.extend({
    constructor: function() {
        User.__super__.constructor.apply(this, arguments);
        this.projectionName = 'User';
    },

    events: {
        User: [
            'userRegistered',
            'nameChanged'
        ]
    },

    userRegistered: function(event) {
        console.log('User registered', event);
        console.log('this', this);
    },
    nameChanged: function(event) {
        console.log('Name changed', event);
        console.log('this', this);
    }
});

module.exports = User;