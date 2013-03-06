define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var StartCommand = function() {
  };

  StartCommand.prototype.execute = function() {
    alert('bla');
    this.context.dispatch('navbar:show');
  };

  return StartCommand;
});