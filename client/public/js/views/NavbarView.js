define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/navbar'
], function ( $, _, Backbone, Marionette, Geppetto, navbarTemplate ) {
  var NavbarView = Marionette.CompositeView.extend({
    template: navbarTemplate,

    initialize: function() {
      console.log('initialize');
    },

    onRender: function() {
      console.log('onRender', this);
    },

    onShow: function() {
      console.log('onShow', this);
    },
  });

  return NavbarView;
});