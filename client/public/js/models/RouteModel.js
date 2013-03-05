define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var RouteModel = Backbone.Model.extend({
    defaults: {
      title: 'default',
      link: 'default',
      nav: false,
      active: false,
    },
  });

  return RouteModel;
});