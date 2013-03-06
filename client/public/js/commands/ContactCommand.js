define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var ContactCommand = function() {
  };

  ContactCommand.prototype.execute = function() {
    this.context.dispatch('show:contact');
  };

  return ContactCommand;
});