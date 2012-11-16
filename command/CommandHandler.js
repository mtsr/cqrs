var CommandHandler = function() {

};

CommandHandler.prototype.handle = function(aggregate, aggregateID, command, data, callback) {
    var response = { aggregate: aggregate, aggregateID: aggregateID, command: command };
    console.log(response);
    callback(null, response);
}

module.exports = new CommandHandler();