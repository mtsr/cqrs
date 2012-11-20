var _ = require('lodash');
var Base = require('./Base');

var Aggregate = Base.extend({
    constructor: function(id) {
        this.id = id;
        this.uncommitedEvents = [];
        this.attributes = { id: id, revision: 0 };
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
            event: name,
            payload: data || {}
        };

        if (!event.payload.id) event.payload.id = this.id;

        return event;
    },

    loadFromHistory: function(data, events) {
        if (data) {
            this.set(data);
        }

        if (events) {
            this.apply(_.map(events, function(evt) {
                evt.fromHistory = true;
                return evt;
            }));
        }
    },

    apply: function(events, callback) {
        var self = this;

        if (!_.isArray(events)) {
            events = [events];
        }

        var historyEvents = [];
        var newEvents = [];
        _.each(events, function(evt) {
            if (evt.fromHistory) {
                historyEvents.push(evt);
            } else {
                newEvents.push(evt);
            }
        });

        _.each(historyEvents, function(evt) {
            self[evt.event](evt.payload);
        });

        this.previousAttributes = this.toJSON();

        _.each(newEvents, function(evt) {
            self[evt.event](evt.payload);
            evt.head = { revision: ++self.attributes.revision };
            self.uncommittedEvents.push(evt);
        });

        if (callback) callback(null);

        return;
    },

    // checkBusinessRules: function(callback) {
    //     var self = this;
    //     var changedAttributes = this.toJSON();
    //     var keys = [];

    //     if(!this.businessRules) return callback(null);

    //     this.businessRules.forEach(function(rule, index) {
    //         rule.call(self, changedAttributes, self.previousAttributes, self.uncommittedEvents, function(ruleId, message) {
    //             if (ruleId) {
    //                 if (!message) {
    //                     message = ruleId;
    //                     ruleId = arguments.callee.caller.name;
    //                 }
    //                 keys.push({ type: 'businessRule', ruleId: ruleId, message: message });
    //             }
    //         });

    //         if (index === self.businessRules.length - 1) {
    //             if (keys.length > 0) {
    //                 self.attributes = self.previousAttributes;
    //                 callback(keys);
    //             } else {
    //                 callback(null);
    //             }
    //         }
    //     });
    // }
});

module.exports = Aggregate;