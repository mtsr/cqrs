define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/navbar',
  'js/views/NavView',
], function ( $, _, Backbone, Marionette, Geppetto, navbarTemplate, NavView ) {
  var NavbarView = Marionette.CompositeView.extend({
    template: navbarTemplate,
    itemView: NavView,
    itemViewContainer: 'ul.nav'
  });

  return NavbarView;
});