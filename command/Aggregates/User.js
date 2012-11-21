var Aggregate = require('../Bases/Aggregate');

var User = Aggregate.extend({
    // Commands

    registerUser: function(data, callback) {
        console.log('User.registerUser');
        this.apply(this.toEvent('userRegistered', data));

        this.checkBusinessRules(callback);
    },

    // Events

    userRegistered: function(data) {
        console.log('User.userRegistered');
        this.set(data);
    },

    // Business rules
    // TODO move to separate file?
    // TODO fix checkBusinessRules to work without business rules as well

    businessRules: [
        function(changed, previous, events, callback) {
            callback(null);
        }
    ],
});

module.exports = User;
