define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/AppLayout'
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout ) {
  var App = new Marionette.Application();

  App.addInitializer(function(options) {
    Backbone.history.start({
      pushState: true,
      // hashchange: false,
      // silent: true,
    });
  });

  App.addInitializer(function(options) {
    this.addRegions({
      mainRegion: '#content'
    });
  });

  App.addInitializer(function(options) {
    var appLayout = new AppLayout();
    this.mainRegion.show(appLayout);
  });

  return App;
});