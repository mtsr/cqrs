var Aggregate = require('../Bases/Aggregate');

var User = Aggregate.extend({
    // Commands

    registerUser: function(data, callback) {
        this.apply(this.toEvent('userRegistered', data));

        // TODO check business rules
    },

    // Events

    userRegistered: function(data) {
        this.set(data);
    }
});

module.exports = User;
