var Base = require('./Base');

var Projection = Base.extend({
    constructor: function() {
        // requiredEvents object
        // contains <aggregate>: [<events>] entries
        this.projectionName = 'unknown';
    },

    events: {},
});

module.exports = Projection;
