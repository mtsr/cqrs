var _ = require('lodash');
var async = require('async');

var Projection = require('../Bases/Projection');

var Chat = Projection.extend({
  constructor: function() {
    Chat.__super__.constructor.apply(this, arguments);
    this.projectionName = 'Chat';

    this.events = {
      Chat: [
        'chatStarted',
        'messageSent'
      ],
      User: [
        'userRegistered',
        'nameChanged'
      ]
    };

    this.collections = {
      Chat: null,
      User: null
    };
  },

  chatStarted: function(event) {
    var self = this;

    console.log('Chat started', event);

    var doc = { aggregateID: event.aggregateID };
    _.extend(doc, event.data);

    async.map(doc.users, function(user, next) {
      self.collections.User.findOne({ aggregateID: user }, function(err, result) {
        if (err) {
          return next(err);
        }
        next(null, result);
      });
    }, function(err, results) {
      if (err) {
        return console.log(err);
      };
      doc.users = results;
      self.collections.Chat.insert(doc, { safe: true }, function(err, result) {
        if (err) {
          console.log(err);
          throw err;
        }
      });
    });
  },

  messageSent: function(event) {
    console.log('Message sent', event);
    this.collections.Chat.update({ aggregateID: event.aggregateID }, { $push: { messages: event.data }}, { safe: true }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  },

  userRegistered: function(event) {
    console.log('User registered', event);
    var doc = { aggregateID: event.aggregateID };
    _.extend(doc, event.data);
    this.collections.User.insert(doc, { safe: true }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
    });

    var set = this.makeSet(event);

    this.collections.Chat.update({ "users.aggregateID": event.aggregateID }, { $set: set }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  },

  nameChanged: function(event) {
    console.log('Name changed', event);
    this.collections.User.update({ aggregateID: event.aggregateID }, { $set: event.data }, { safe: true }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
    });

    var set = this.makeSet(event);

    this.collections.Chat.update({ "users.aggregateID": event.aggregateID }, { $set: set }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  }
});

module.exports = Chat;