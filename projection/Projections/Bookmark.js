var _ = require('lodash');

var Projection = require('../Bases/Projection');

var Bookmark = Projection.extend({
  constructor: function() {
    Bookmark.__super__.constructor.apply(this, arguments);
    this.projectionName = 'Bookmark';

    this.events = {
      Bookmark: [
        'bookmarkCreated',
      ]
    };

    this.collections = {
      Bookmark: null,
    };
  },

  bookmarkCreated: function(event) {
    console.log('Bookmark created', event);
    var doc = { aggregateID: event.aggregateID };
    _.extend(doc, event.data);
    this.collections.Bookmark.insert(doc, { safe: true }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  },
});

module.exports = Bookmark;