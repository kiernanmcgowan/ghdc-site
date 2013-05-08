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
    _.each(output, function(obj) {
      console.log(obj.val);
      tbody.append($(self.lineTemplate(obj)));
    });
  }

});
