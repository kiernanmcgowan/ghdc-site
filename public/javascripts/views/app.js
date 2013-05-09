// app-view.js
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  el: 'body',

  currentScope: null,

  initialize: function() {
    // set up the socket.io sync layer
    require('../utils/sync');

    // now load our data - stay in full scope
    var listModel = require('../models/word-list');
    this.weightList = new listModel({filter: this.currentScope, count: 10});
    this.weightList.fetch();

    var sugg = require('../models/suggestion');
    // the model to handle suggestions to server
    this.suggestion = new sugg();

    // filter list
    var filterList = require('../models/filter-list');
  },

  render: function() {
    // load up the views with the current scope
    var barChart = require('../views/bar-chart');
    var pieChart = require('../views/pie-chart');
    var filterView = require('../views/filter');
    var suggestView = require('../views/suggestion');
    var suggestChartView = require('../views/suggestion-chart');


    var self = this;
    this.suggestion.on('change:filter change:type', function() {
      self.weightList.set('filter', self.suggestion.get('filter'));
      //self.weightList.set('type', self.suggestion.get('type'));
      self.weightList.fetch();
    });

    // create the overview chart
    var listModel = require('../models/word-list');
    var allMod = new listModel({count: 15});
    var allChart = new barChart({
      model: allMod,
      el: '#all'
    });
    allChart.render();
    allMod.fetch();

    var jsMod = new listModel({count: 10, filter: 'JavaScript'});
    var jsChart = new barChart({
      model: jsMod,
      el: '#js'
    });
    jsChart.render();
    jsMod.fetch();

    var rubyMod = new listModel({count: 10, filter: 'Ruby'});
    var rubyChart = new barChart({
      model: rubyMod,
      el: '#ruby'
    });
    rubyChart.render();
    rubyMod.fetch();

    var phpMod = new listModel({count: 10, filter: 'PHP'});
    var phpChart = new barChart({
      model: phpMod,
      el: '#php'
    });
    phpChart.render();
    phpMod.fetch();

    var coffeescriptMod = new listModel({count: 15, filter: 'CoffeeScript'});
    var coffeescriptChart = new barChart({
      model: coffeescriptMod,
      el: '#cs'
    });
    coffeescriptChart.render();
    coffeescriptMod.fetch();

    var broMod = new listModel({count: 15, filter: 'Bro'});
    var broChart = new barChart({
      model: broMod,
      el: '#bro'
    });
    broChart.render();
    broMod.fetch();

    // bottom ui
    var filter = new filterView({
      el: '#filter',
      model: this.suggestion
    });
    filter.render();

    var weightChart = new barChart({
      model: this.weightList,
      el: '#weight'
    });
    weightChart.render();

    var suggest = new suggestView({
      model: this.suggestion,
      el: '#suggest'
    });
    suggest.render();

    var suggestChart = new suggestChartView({
      model: this.suggestion,
      el: '#chartOutput'
    });
    suggestChart.render();
  }

});

