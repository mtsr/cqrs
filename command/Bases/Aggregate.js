var _ = require('lodash');
var Base = require('./Base');

var Aggregate = Base.extend({
    constructor: function(id) {
        this.id = id;
        this.uncommittedEvents = [];
        this.attributes = { id: id, revision: -1 };

        this.aggregateType = 'unknown';
    },

    set: function(data) {
        // arguments: attributeName, attributeValue
        if (arguments.length === 2) {
            this.attributes[arguments[0]] = arguments[1];
        } else {
            // argument is object
            for(var m in data) {
                this.attributes[m] = data[m];
            }
        }
    },

    get: function(attribute) {
        return this.attributes[attribute];
    },

    toJSON: function() {
        return _.clone(this.attributes, true);
    },

    toEvent: function(name, data) {
        var event = {
            aggregateType: this.aggregateType,
            aggregateID: this.id,
            event: name,
            data: data || {}
        };

        return event;
    },

    loadFromHistory: function(data, events) {
        var self = this;

        console.log('Aggregate.loadFromHistory:', data?'snapshot + ':'' + events.length, 'events');
        if (data) {
            this.set(data);
        }

        if (events) {
            _.each(events, function(event) {
                console.log(event);
                // update revision
                self.attributes.revision = event.streamRevision;
                self[event.payload.event](event.payload.data);
            });

            this.previousAttributes = this.toJSON();
        }
    },

    apply: function(events, callback) {
        var self = this;

        console.log('Aggregate.apply', events);
        var self = this;

        if (!_.isArray(events)) {
            events = [events];
        }

        _.each(events, function(event) {
            self[event.event](event.data);
            self.uncommittedEvents.push(event);
        });

        if (callback) callback(null);

        return;
    },

    checkBusinessRules: function(callback) {
        var self = this;
        var changedAttributes = this.toJSON();
        var keys = [];

        if(!this.businessRules) return callback(null);

        this.businessRules.forEach(function(rule, index) {
            rule.call(self, changedAttributes, self.previousAttributes, self.uncommittedEvents, function(ruleId, message) {
                if (ruleId) {
                    if (!message) {
                        message = ruleId;
                        ruleId = arguments.callee.caller.name;
                    }
                    keys.push({ type: 'businessRule', ruleId: ruleId, message: message });
                }
            });
        });

        if (keys.length > 0) {
            self.attributes = self.previousAttributes;
            callback(keys);
        } else {
            callback(null);
        }
    }
});

module.exports = Aggregate;