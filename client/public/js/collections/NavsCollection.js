define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/models/NavModel'
], function ( $, _, Backbone, Marionette, Geppetto, NavModel ) {
  var NavsCollection = Backbone.Collection.extend({
    model: NavModel,
  });

  return NavsCollection;
});