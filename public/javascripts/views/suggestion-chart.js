// suggestion-chart
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  template: require('suggest-chart'),

  lineTemplate: require('suggestion-line'),


  initialize: function() {
    var self = this;
    this.model.on('change:output', function() {
      self.showOutput();
    });
  },

  render: function() {
    $(this.el).html(this.template({}));
  },

  showOutput: function() {
    var output = this.model.get('output');
    var tbody = $(this.$el.find('.chart')[0]);
    // clean it out
    tbody.empty();
    var self = this;
    var mm = this.model.get('mm');

    // sort putput real quick
    output = _.sortBy(output, function(o) {
      return -1 * o.val;
    });

    _.each(output, function(obj) {
      obj.res = '';
      obj.title = '';
      tbody.append($(self.lineTemplate(obj)));
    });

    this.$el.find('tr').tooltip();
  }

});
