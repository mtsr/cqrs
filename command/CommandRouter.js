var CommandRouter = function() {

};

CommandRouter.prototype.handle = function(aggregate, aggregateID, command) {
    return { aggregate: aggregate, aggregateID: aggregateID, command: command };
}

module.exports = new CommandRouter();