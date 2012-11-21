var CommandHandlerBase = require('cqrs-domain').commandHandlerBase;

var User = CommandHandlerBase.extend({

    aggregate: 'User',

    commands: ['registerUser' ],

    // fooIt: function(id, cmd) {
    //     var self = this;
    //     (new this.Command({
    //         command: 'createFoo',
    //         payload: {
    //             name: 'bla'
    //         }
    //     })).emit(function(evt) {
    //         cmd.payload.fooId = evt.payload.id;
    //         self.defaultHandle(id, cmd);
    //     });
    // }

});

module.exports = User;