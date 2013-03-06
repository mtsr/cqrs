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
  };

  return NavigateCommand;
});