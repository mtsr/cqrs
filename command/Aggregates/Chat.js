var Aggregate = require('../Bases/Aggregate');

var Chat = Aggregate.extend({
  constructor: function() {
    Chat.__super__.constructor.apply(this, arguments);
    this.aggregateType = 'Chat';
    this.attributes = {
      messages: [],
      users: [],
    }
  },

  // Commands

  startChat: function(data, callback) {
    console.log('Chat.startChat:', data);

    if (this.attributes.revision >= 0) {
      return callback('Can\'t start Chat with aggregateID', this.id, 'ID already in use.')
    }

    this.apply(this.toEvent('chatStarted', data));

    this.checkBusinessRules(callback);
  },

  sendMessage: function(data, callback) {
    console.log('Chat.changeName:', data);

    if (this.attributes.revision < 0) {
      return callback('Can\'t change name for new Chat. Register Chat first.');
    }

    if (this.attributes.users.indexOf(data.authorID) < 0) {
      return callback('Can\'t send message to chat ' + this.id + ' for user ' + data.authorID + '. User not part of chat.');
    }

    this.apply(this.toEvent('messageSent', data));

    this.checkBusinessRules(callback);
  },

  // Events

  chatStarted: function(data) {
    // console.log('Chat.userRegistered');
    this.set(data);
  },

  messageSent: function(data) {
    this.attributes.messages.push(data);
  },

  // Business rules
  // TODO move to separate file?

  businessRules: [
    // function(changed, previous, events, callback) {
    //   callback(null);
    // }
  ],
});

module.exports = Chat;
