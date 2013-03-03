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
    this.context.router.navigate($(this.eventData.target).attr('href'), { trigger: true });
  };

  return NavigateCommand;
});