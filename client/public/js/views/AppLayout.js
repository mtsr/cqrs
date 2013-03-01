define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/appLayout'
], function ( $, _, Backbone, Marionette, Geppetto, appTemplate ) {
  var AppLayout = Marionette.Layout.extend({
    template: appTemplate,

    regions: {
      navbarRegion: '#navbar',
      sidebarRegion: '#sidebar',
      contentRegion: '#content',
      footerRegion: '#footer',
    },
  });

  return AppLayout;
});