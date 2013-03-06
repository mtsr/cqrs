define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var AboutCommand = function() {
  };

  AboutCommand.prototype.execute = function() {
    this.context.dispatch('show:about');
  };

  return AboutCommand;
});