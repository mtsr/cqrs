var Aggregate = require('../Bases/Aggregate');

var Bookmark = Aggregate.extend({
  constructor: function() {
    Bookmark.__super__.constructor.apply(this, arguments);
    this.aggregateType = 'Bookmark';
    this.attributes = {
      URL: null,
      content: null,
    }
  },

  // Commands

  createBookmark: function(data, callback) {
    console.log('Bookmark.createBookmark', data);

    if (this.attributes.revision >= 0) {
      return callback('Can\'t create bookmark with aggregateID', this.id + '. ID already in use.')
    }

    this.apply(this.toEvent('bookmarkCreated', data));

    this.checkBusinessRules(callback);
  },

  // Events

  bookmarkCreated: function(data) {
    this.set(data);
  },

  // Business rules
  // TODO move to separate file?

  businessRules: [
    // function(changed, previous, events, callback) {
    //   callback(null);
    // }
  ],
});

module.exports = Bookmark;
