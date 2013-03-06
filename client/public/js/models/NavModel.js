define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var NavModel = Backbone.Model.extend({
    defaults: {
      title: 'default',
      link: 'default',
      active: false,
    },
  });

  return NavModel;
});