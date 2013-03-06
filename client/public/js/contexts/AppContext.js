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
        new RouteModel({ title: 'Home', link: '', nav: true, commandName: 'home' }),
        new RouteModel({ title: 'About', link: 'about', nav: true, commandName: 'about' }),
        new RouteModel({ title: 'Contact', link: 'contact', nav: true, commandName: 'contact' }),
      ]);
      this.router = new AppContextRouter({
        context: this,
        routes: this.routes.reduce(function(memo, route) {
          var callback = function(fragment) {
            this.dispatch('route:' + route.get('commandName'));
          }.bind(this);
          memo[route.get('link')] = callback;
          return memo;
        }, {}),
      });
    },

    commands: {
      'home': StartCommand,
      'navigate': NavigateCommand,
      'about contact': NavigateCommand,
    },
  });

  return AppContext;
});