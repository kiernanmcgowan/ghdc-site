// filter-view
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  template: require('filter'),

  events: {
    'keyup input.filter': 'filter'
  },

  initialize: function() {
    this.model = require('../models/filter-list');
    // update the source binding if it exists
    var self = this;
    this.model.on('change:lang', function() {
      var lang = self.model.get('lang');
      self.$el.find('.filter').autocomplete('option', 'source', lang);
    });
  },

  render: function() {
    $(this.el).html(this.template({}));
    this.$el.find('.filter').autocomplete({
      source: this.model.get('lang')
    });
  },

  filter: function() {
    console.log((this.$el.find('input'))[0]);
    var currentInp = $((this.$el.find('input'))[0]).val().toLowerCase();
    var list = this.model.filter(currentInp);
  }

});

