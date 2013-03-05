define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/views/AppLayout',
  'js/contexts/AppContext',
], function ( $, _, Backbone, Marionette, Geppetto, AppLayout, AppContext ) {
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
    Geppetto.bindContext({
      view: this,
      context: AppContext,
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