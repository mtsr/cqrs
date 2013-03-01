define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/views/AppLayout',
  'js/views/NavbarView',
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout, NavbarView ) {
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

    var navbarView = new NavbarView();
    appLayout.navbarRegion.show(navbarView);
  });

  return App;
});