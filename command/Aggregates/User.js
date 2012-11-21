var Aggregate = require('../Bases/Aggregate');

var User = Aggregate.extend({
    // Commands

    registerUser: function(data, callback) {
        console.log('User.registerUser:', data);

        if (this.attributes.revision >= 0) {
            return callback('Can\'t register User with aggregateID', this.id, 'ID already in use.')
        }

        this.apply(this.toEvent('userRegistered', data));

        this.checkBusinessRules(callback);
    },

    changeName: function(data, callback) {
        console.log('User.changeName:', data);

        if (this.attributes.revision < 0) {
            return callback('Can\'t change name for new User. Register User first.');
        }

        this.apply(this.toEvent('nameChanged', data));

        this.checkBusinessRules(callback);
    },

    // Events

    userRegistered: function(data) {
        // console.log('User.userRegistered');
        this.set(data);
    },

    nameChanged: function(data) {
        this.set(data);
    },

    // Business rules
    // TODO move to separate file?
    // TODO fix checkBusinessRules to work without business rules as well

    businessRules: [
        // function(changed, previous, events, callback) {
        //     callback(null);
        // }
    ],
});

module.exports = User;
