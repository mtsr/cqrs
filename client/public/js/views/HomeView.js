define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/home',
], function ( $, _, Backbone, Marionette, Geppetto, homeTemplate ) {
  var HomeView = Marionette.CompositeView.extend({
    template: homeTemplate,

    contextEvents: {
    },

    initialize: function(options) {
      Geppetto.bindContext({
        view: this,
        context: options.context,
      });
    },
  });

  return HomeView;
});