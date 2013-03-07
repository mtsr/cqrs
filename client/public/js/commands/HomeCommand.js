define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.marionette',
  'backbone.geppetto',
  'js/collections/BookmarksCollection',
], function ( $, _, Backbone, Marionette, Geppetto, BookmarksCollection ) {
  var HomeCommand = function() {
  };

  HomeCommand.prototype.execute = function() {
    this.context.dispatch('show:home');
    this.context.bookmarksCollection = new BookmarksCollection();

    $.ajax({
      'type': 'GET',
      'url': 'http://localhost:3001/Bookmark',
      'success': function(data, textStatus, jqXHR) {
        console.log(data);
      },
    });
  };

  return HomeCommand;
});