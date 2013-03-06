define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/routers/ContextRouter',
], function ( $, _, Backbone, Marionette, Geppetto, ContextRouter ) {
  AppContextRouter = ContextRouter.extend({
    initialize: function(options) {
      // TODO use bindContext here if for whatever reason we need to listen to events to
      // runs into an circular initialization problem, though
      this.context = options.context;
    },

    // routes with callback on this.controller
    appRoutes: {
    },

    // routes with callback in the router
    routes : {
    },

    // routes that dispatch an event to this.context
    contextRoutes: {
      '': 'route:home',
      'about': 'route:about',
      'contact': 'route:contact',
    }
  });
  return AppContextRouter;
});

