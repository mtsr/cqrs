var CommandHandler = function(eventStore) {
    this.eventStore = eventStore;
};

CommandHandler.prototype.handle = function(aggregate, aggregateID, command, data, callback) {
    var response = { aggregate: aggregate, aggregateID: aggregateID, command: command };
    console.log(response);
    callback(null, response);
    this.eventStore.getEventStream(aggregateID, 0, function(err, eventStream) {
        console.log('EventStream gotten', eventStream.events);
        eventStream.addEvent({ command: command });
        eventStream.commit();
    });
}

module.exports = CommandHandler;