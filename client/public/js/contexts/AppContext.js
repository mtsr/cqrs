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
      this.routes = new RoutesCollection([
        new RouteModel({ title: 'Home', link: '', nav: true }),
        new RouteModel({ title: 'About', link: 'about', nav: true }),
        new RouteModel({ title: 'Contact', link: 'contact', nav: true }),
      ]);
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