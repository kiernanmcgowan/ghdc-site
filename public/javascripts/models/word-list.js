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
    var avg = 0;
    var list = this.get('list');
    _.each(list, function(obj) {
      avg += obj.count;
    });
    avg = avg / list.length;
    this.set('average', avg);
  }

});
