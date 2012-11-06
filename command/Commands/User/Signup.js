var Command = require('../Command');

var Signup = function() {
    // call parent constructor
    Command.call(this);
};

Signup.prototype = new Command();
Signup.constructor = Signup;

Signup.prototype.run = function() {
    console.log('Signup!');
};

module.exports = Signup;