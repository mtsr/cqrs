define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/views/AppLayout',
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout ) {
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
  });

  return App;
});