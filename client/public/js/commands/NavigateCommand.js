define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var NavigateCommand = function() {
  };

  NavigateCommand.prototype.execute = function() {
    this.eventData.preventDefault();

    var link = $(this.eventData.target).attr('href');
    this.context.router.navigate(link, { trigger: true });

    // TODO this needs to be done AFTER the router so that it also gets called for the initial route
    this.context.routes.each(function(route) {
      if (route.get('link') === link) {
        route.set('active', true);
      } else {
        route.set('active', false);
      }
    });
  };

  return NavigateCommand;
});