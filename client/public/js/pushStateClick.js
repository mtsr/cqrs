define([
  'jquery',
  'underscore',
  'backbone',
], function ( $, _, Backbone) {
  var NewBackboneView = Backbone.View.extend({
    events: {
      'click a': 'pushStateClick',
    },

    pushStateClick: function(event) {
      event.preventDefault();
    },
  });

  Backbone.View = NewBackboneView;
});