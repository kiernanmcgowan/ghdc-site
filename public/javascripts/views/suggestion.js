// suggestion
// view for helping people choose better words
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  template: require('suggestion'),

  lineTemplate: require('suggestion-line'),

  stopwords: require('../utils/stopwords'),

  events: {
    'keyup textarea': 'suggest'
  },

  initialize: function() {
    var self = this;
    this.model.on('request', function() {
      self.showLoader();
    });
    this.model.on('sync', function() {
      self.hideLoader();
    });
    this.model.fetch();
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
  },

  suggest: function() {
    var text = $(this.$el.find('textarea')[0]).val();
    text = text.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    var words = text.split(' ');
    words = _.difference(words, this.stopwords);

    if (words.length > 0) {
      this.model.set('input', words);
    }
  },

  showLoader: function() {
    this.$el.find('.loader').css('display', 'inline-block');
  },

  hideLoader: function() {
    this.$el.find('.loader').css('display', 'none');
  }

});
