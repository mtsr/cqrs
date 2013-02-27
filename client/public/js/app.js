define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/AppLayout'
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout ) {
  var app = new Marionette.Application();

  app.addInitializer(function(options) {
    Backbone.history.start({
      pushState: true,
      // hashchange: false,
      // silent: true,
    });
  });

  app.addInitializer(function(options) {
    this.addRegions({
      mainRegion: 'body'
    });
  });

  app.addInitializer(function(options) {
    var appLayout = new AppLayout();
    this.mainRegion.show(appLayout);
  });

  return app;
});