define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/commands/StartCommand',
], function ( $, _, Backbone, Marionette, Geppetto, StartCommand ) {
  var AppContext = Geppetto.Context.extend({
    initialize: function(options) {
      this.navCollection = options.navCollection;
    },

    commands: {
      'start': StartCommand,
    },
  });

  return AppContext;
});