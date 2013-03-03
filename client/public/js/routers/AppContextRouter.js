define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  AppContextRouter = Backbone.Marionette.AppRouter.extend({
    initialize: function(options) {
      // TODO use bindContext here if for whatever reason we need to listen to events to
      // runs into an initialization order problem, though
      this.context = options.context;
    },

    // routes with callback on this.controller
    appRoutes: {
    },

    // routes with callback in the router
    routes : {
      '/' : 'home',
    },

    home: function(){
      this.context.dispatch('show:home');
    },
  });
  return AppContextRouter;
});

