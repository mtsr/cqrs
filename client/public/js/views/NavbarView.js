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
  });

  return NavbarView;
});