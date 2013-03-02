define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/nav',
], function ( $, _, Backbone, Marionette, Geppetto, navTemplate ) {
  var NavView = Marionette.ItemView.extend({
    template: navTemplate,
    tagName: 'li',

    events: {
      'click a': 'navClicked',
    },

    navClicked: function(event) {
      event.preventDefault();
    }
  });

  return NavView;
});