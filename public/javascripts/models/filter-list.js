// filter list
var Backbone = require('backbone');
var _ = require('underscore');

var model = Backbone.Model.extend({

  url: 'filter',

  sync: require('../utils/sync'),

  initialize: function() {
    // get the data right away
    this.fetch();
  },

  filter: function(filt) {
    // filter through the word list
    var dispWords = [];
    _.each(this.get('lang'), function(word) {
      if (word.toLowerCase().indexOf(filt) != -1) {
        dispWords.push(word);
      }
    });
    console.log(dispWords);
    return dispWords;
  }

});

// have a singleton
module.exports = new model();
