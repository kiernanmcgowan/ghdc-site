// suggestion
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({

  url: 'suggestion',

  sync: require('../utils/sync'),

  defaults: {
    input: null,
    output: null,
    type: 'weight',
    filter: null
  },

  initialize: function() {
    this.on('change:input', _.debounce(this.fetch, 500), this);
  }

});
