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

    modelEvents: {
      // TODO highlighting active Nav not working because model isn't updated
      'change:active': 'setActive',
    },

    initialize: function(options) {
      Geppetto.bindContext({
        view: this,
        context: options.context,
      });
    },

    setActive: function(model, active) {
      this.$el.toggleClass('active', active);
    },
  });

  return NavView;
});