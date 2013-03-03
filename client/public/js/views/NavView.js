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
    },

    initialize: function(options) {
      Geppetto.bindContext({
        view: this,
        context: options.context,
      });
    },
  });

  return NavView;
});