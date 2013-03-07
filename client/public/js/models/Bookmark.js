define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
], function ( $, _, Backbone, Marionette, Geppetto ) {
  var NavModel = Backbone.Model.extend({
    defaults: {
      URL: null,
      content: null,
    },
  });

  return NavModel;
});