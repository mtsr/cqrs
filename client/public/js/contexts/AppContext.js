define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/models/RouteModel',
  'js/collections/RoutesCollection',
  'js/routers/AppContextRouter',
  'js/commands/StartCommand',
  'js/commands/NavigateCommand',
], function ( $, _, Backbone, Marionette, Geppetto, RouteModel, RoutesCollection, AppContextRouter, StartCommand, NavigateCommand ) {
  var AppContext = Geppetto.Context.extend({
    initialize: function(options) {
      this.router = new AppContextRouter({
        context: this,
      });
    },

    commands: {
      'route:home': StartCommand,
      'navigate': NavigateCommand,
      // 'route:about route:contact': NavigateCommand,
    },
  });

  return AppContext;
});