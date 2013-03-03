define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/routers/AppContextRouter',
  'js/commands/StartCommand',
  'js/commands/NavigateCommand',
], function ( $, _, Backbone, Marionette, Geppetto, AppContextRouter, StartCommand, NavigateCommand ) {
  var AppContext = Geppetto.Context.extend({
    initialize: function(options) {
      this.navCollection = options.navCollection;
      this.router = new AppContextRouter({
        context: this,
      });
    },

    commands: {
      'start': StartCommand,
      'navigate': NavigateCommand,
    },
  });

  return AppContext;
});