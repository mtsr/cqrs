define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/models/BookmarkModel'
], function ( $, _, Backbone, Marionette, Geppetto, BookmarkModel ) {
  var BookmarksCollection = Backbone.Collection.extend({
    model: BookmarkModel,
  });

  return BookmarksCollection;
});