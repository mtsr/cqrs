define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/appLayout',
  'js/views/NavbarView',
], function ( $, _, Backbone, Marionette, Geppetto, appTemplate, NavbarView ) {
  var AppLayout = Marionette.Layout.extend({
    template: appTemplate,

    regions: {
      navbarRegion: '#navbar',
      sidebarRegion: '#sidebar',
      contentRegion: '#content',
      footerRegion: '#footer',
    },

    contextEvents: {
      'navbar:show': 'showNavbar'
    },

    initialize: function(options) {
      Geppetto.bindContext({
        view: this,
        context: options.context,
      })
    },

    showNavbar: function() {
      var navbarView = new NavbarView({
        collection: this.context.navCollection,
      });
      this.navbarRegion.show(navbarView);
    },
  });

  return AppLayout;
});