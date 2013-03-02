define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/views/AppLayout',
  'js/collections/NavsCollection',
  'js/models/NavModel',
  'js/contexts/AppContext',
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout, NavsCollection, NavModel, AppContext ) {
  var App = new Marionette.Application();

  App.on('initialize:after', function() {
    Backbone.history.start({
      pushState: true,
      // hashchange: false,
      // silent: true,
    });
  });

  App.addInitializer(function(options) {
    this.addRegions({
      mainRegion: '#app'
    });
  });

  App.addInitializer(function(options) {
    var navCollection = new NavsCollection([
      new NavModel({ navTitle: 'Home', navLink: '/' }),
      new NavModel({ navTitle: 'About', navLink: '/about' }),
      new NavModel({ navTitle: 'Contact', navLink: '/contact' }),
    ]);

    this.context = new AppContext({
      navCollection: navCollection,
    });

    var appLayout = new AppLayout({
      context: this.context,
    });
    this.mainRegion.show(appLayout);
  });

  App.on('start', function() {
    this.context.dispatch('start');
  });

  return App;
});