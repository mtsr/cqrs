define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'templates/appTemplate'
], function ( $, _, Backbone, Marionette, Geppetto, appTemplate ) {
  var AppLayout = Marionette.Layout.extend({
    template: appTemplate
  });
});