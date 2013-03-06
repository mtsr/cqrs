define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var HomeCommand = function() {
  };

  HomeCommand.prototype.execute = function() {
    this.context.dispatch('show:home');
  };

  return HomeCommand;
});