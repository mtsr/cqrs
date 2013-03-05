define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/models/RouteModel'
], function ( $, _, Backbone, Marionette, Geppetto, RouteModel ) {
  var RoutesCollection = Backbone.Collection.extend({
    model: RouteModel,
  });

  return RoutesCollection;
});