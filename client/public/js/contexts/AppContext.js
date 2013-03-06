define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/routers/AppContextRouter',
  'js/commands/NavigateCommand',
  'js/commands/HomeCommand',
  'js/commands/AboutCommand',
  'js/commands/ContactCommand',
], function ( $, _, Backbone, Marionette, Geppetto, AppContextRouter, NavigateCommand, HomeCommand, AboutCommand, ContactCommand ) {
  var AppContext = Geppetto.Context.extend({
    initialize: function(options) {
      this.router = new AppContextRouter({
        context: this,
      });
      this.navsCollection = options.navsCollection;
    },

    commands: {
      'navigate': NavigateCommand,
      'route:home': HomeCommand,
      'route:about': AboutCommand,
      'route:contact': ContactCommand,
    },
  });

  return AppContext;
});