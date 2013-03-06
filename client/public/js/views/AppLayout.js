define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/appLayout',
  'js/contexts/AppContext',
  'js/models/NavModel',
  'js/collections/NavsCollection',
  'js/views/NavbarView',
  'js/views/HomeView',
], function ( $, _, Backbone, Marionette, Geppetto, appTemplate, AppContext, NavModel, NavsCollection, NavbarView, HomeView ) {
  var AppLayout = Marionette.Layout.extend({
    template: appTemplate,

    events: {
      'click a:not([data-bypass])': 'linkClicked',
    },

    regions: {
      navbarRegion: '#navbar',
      sidebarRegion: '#sidebar',
      contentRegion: '#content',
      footerRegion: '#footer',
    },

    contextEvents: {
      'show:home': 'showHome',
    },

    initialize: function(options) {
      Geppetto.bindContext({
        view: this,
        context: AppContext,
        navsCollection: new NavsCollection([
          new NavModel({ title: 'Home', link: '/', }),
          new NavModel({ title: 'About', link: '/about', }),
          new NavModel({ title: 'Contact', link: '/contact', }),
        ]),
      });
    },

    linkClicked: function(event) {
      this.context.dispatch('navigate', event);
    },

    onShow: function() {
      this.showNavbar();
    },

    showNavbar: function() {
      var navbarView = new NavbarView({
        context: this.context,
        collection: this.context.navsCollection,
      });
      this.navbarRegion.show(navbarView);
    },

    showHome: function() {
      var homeView = new HomeView({
        context: this.context,
      });
      this.contentRegion.show(homeView);
    },
  });

  return AppLayout;
});