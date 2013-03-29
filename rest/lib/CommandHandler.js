"use strict";

var async = require('async');
var amqp = require('amqp');

var CommandHandler = function() {
  this.requestID = 0;
  this.replyQueue = [];

  this.exchange = null;
}

CommandHandler.prototype.init = function(ready) {
  async.auto({
    'connection': [function(done, results) {
      var connection = amqp.createConnection();

      process.on('SIGINT', function() {
        connection.end();
      });

      connection.on('ready', function() { done(null, connection); });
    }.bind(this)],
    'exchange': ['connection', function(done, results) {
      results.connection.exchange('command', { type: 'direct', confirm: true }, function(exchange) {
        this.exchange = exchange;
        done(null, exchange);
      }.bind(this));
    }.bind(this)],
    'queue': ['connection', function(done, results) {
      results.connection.queue('rest', { durable: true, autoDelete: false }, function(queue) {
        queue.bind('command', 'rest');
        done(null, queue);
      });
    }.bind(this)],
    'subscription': ['queue', function(done, results) {
      results.queue.subscribe({ ack: true, prefetchCount: 5 }, function(payload, headers, deliveryInfo, message) {
        console.log('Message from queue:', payload, headers, deliveryInfo);
        var callback = self.replyQueue[deliveryInfo.correlationId];
        if (callback) {
          callback(payload.error, payload.response);
        } else {
          console.log('ERROR: CorrelationId', deliveryInfo.correlationId, 'not in reply queue');
        }
        message.acknowledge();
      });
      done();
    }.bind(this)],
  }, function(err, results) {
    ready(err);
  });
};

CommandHandler.prototype.handle = function(commandData, callback) {
  this.replyQueue[this.requestID] = callback;

  var messageData = {
    replyTo: 'rest',
    correlationId: this.requestID.toString()
  };

  this.exchange.publish('command', commandData, messageData, function() {
    console.log('Publish callback:', arguments);
  });
  this.requestID++;
}

module.exports = CommandHandler;