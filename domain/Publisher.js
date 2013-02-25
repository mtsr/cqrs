var Publisher = function(exchange) {
  this.exchange = exchange;
}

Publisher.prototype.publish = function(event) {
  console.log('Event published', event);
  this.exchange.publish('event', event, {}, function() {
    console.log('Event published');
  });
}

module.exports = Publisher;