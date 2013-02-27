define([
  "jquery",
  "underscore",
  "backbone",
  "backbone.marionette",
  "backbone.geppetto"
], function ( $, _, Backbone, Marionette, Geppetto, WidgetContainer ) {
  var app = new Marionette.Application();

  app.addInitializer(function(options) {
    Backbone.history.start({
      pushState: true,
      // hashchange: false,
      // silent: true,
    });
  });

  app.addInitializer(function(options) {
    $( "#loadingSpinner" ).hide();
  });

  return app;
});