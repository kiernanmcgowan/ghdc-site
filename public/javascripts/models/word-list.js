// word-list
// word list for a context
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({

  url: 'data',

  sync: require('../utils/sync'),

  initialize: function() {
    this.on('change:list', this.calcAverage, this);
  },

  calcAverage: function() {
    console.log(this.get('mm'));
  }

});
