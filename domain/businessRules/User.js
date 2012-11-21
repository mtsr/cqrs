var _ = require('lodash');
var async = require('async');

var User = {
    User: [
        function(changed, previous, events, callback) {
            console.log('Business rules event:', events);
            callback(null);
        },
    ],
}

module.exports = User;
