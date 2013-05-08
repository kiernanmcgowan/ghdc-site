// filter-view
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  template: require('filter'),

  events: {
    'click input[type=radio]': 'changeType',
    'change .langSelect': 'changeLanguage'
  },

  initialize: function() {
    this.langs = require('../models/filter-list');
    // update the source binding if it exists
    var self = this;
    this.langs.on('change:lang', function() {
      var lang = self.model.get('lang');
      self.updateLangList();
    });
    this.model.on('request', function() {
      //console.log('disable');
    });
    this.model.on('sync', function() {
      //console.log('enable');
    });
  },

  render: function() {
    $(this.el).html(this.template({}));
    this.langSelect = $(this.$el.find('.langSelect')[0]);
    if (this.langs.isLoaded) {
      this.updateLangList();
    }
  },

  changeLanguage: function(evt) {
    var newLang = $(this.$el.find('option:selected')[0]).val();
    this.model.set('filter', newLang);
    this.model.fetch();
  },

  updateLangList: function() {
    var lang = this.langs.get('lang');
    this.langSelect.empty();
    var self = this;
    _.each(lang, function(l) {
      self.langSelect.append($('<option val="' + l + '">' + l + '</option>'));
    });
  },

  filter: function() {
    //console.log((this.$el.find('input'))[0]);
    //var currentInp = $((this.$el.find('input'))[0]).val().toLowerCase();
    //var list = this.model.filter(currentInp);
  },

  changeType: function(evt) {
    var newType = $(evt.target).val();
    this.model.set('type', newType);
    // and update!
    this.model.fetch();
  }

});

