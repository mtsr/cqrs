define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/views/AppLayout',
  'js/views/NavbarView',
  'js/collections/NavsCollection',
  'js/models/NavModel',
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout, NavbarView, NavsCollection, NavModel ) {
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
    var appLayout = new AppLayout();
    this.mainRegion.show(appLayout);

    var navCollection = new NavsCollection([
      new NavModel({ navTitle: 'Home', navLink: '/' }),
      new NavModel({ navTitle: 'About', navLink: '/about' }),
      new NavModel({ navTitle: 'Contact', navLink: '/contact' }),
    ]);

    var navbarView = new NavbarView({
      collection: navCollection,
    });
    appLayout.navbarRegion.show(navbarView);
  });

  return App;
});