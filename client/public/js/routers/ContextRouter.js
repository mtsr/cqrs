define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  ContextRouter = Marionette.AppRouter.extend({
    constructor: function(options) {
      var args = Array.prototype.slice.apply(arguments);
      Marionette.AppRouter.prototype.constructor.apply(this, args);

      this.processContextRoutes();
    },

    processContextRoutes: function() {
      var context = this.context;
      var contextRoutes = this.contextRoutes;
      if (!context || !contextRoutes) {
        return;
      }

      _.each(contextRoutes, function(commandName, route) {
        var callback = function() {
          this.context.dispatch(commandName, arguments);
        }.bind(this);
        this.route(route, 'dispatch', callback);
      }.bind(this));
    }
  });
  return ContextRouter;
});