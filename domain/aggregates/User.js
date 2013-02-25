var Base = require('cqrs-domain').aggregateBase;

var User = Base.extend({

  // Command

  registerUser: function(data, callback) {
    console.log('registerUser BEFORE:', this);
    if (this.previousAttributes.revision > 0) {
      var message = 'AggregateID already in use';
      console.log(message);
      return callback(message);
    }

    this.apply(this.toEvent('userRegistered', data));
    console.log('registerUser AFTER:', this);

    this.checkBusinessRules(callback);
  },

  // Events

  userRegistered: function(data) {
    this.set(data);
  },
});

module.exports = User;