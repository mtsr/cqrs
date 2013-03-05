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
    itemViewContainer: 'ul.nav',

    contextEvents: {
    },

    // use a function for itemViewOptions to be able to get
    // properties that aren't initialized yet
    itemViewOptions: function() {
      return {
        context: this.context,
      };
    },

    initialize: function(options) {
      Geppetto.bindContext({
        view: this,
        context: options.context,
      });
    },
  });

  return NavbarView;
});