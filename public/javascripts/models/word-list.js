// word-list
// word list for a context
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({

  url: 'data',

  sync: require('../utils/sync'),

  defaults: {
    type: 'weight',
    filter: null,
    count: 5
  },

  initialize: function() {
  }

});
