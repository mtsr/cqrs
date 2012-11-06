var CommandRouter = function() {

};

CommandRouter.prototype.route = function(req, res) {
    var commandName = req.url;
    var Command = require('./Commands'+commandName);
    var command = new Command();

    command.run();
    res.send('CommandRouter');
}

module.exports = new CommandRouter();