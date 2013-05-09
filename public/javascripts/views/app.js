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
    this.listModel = require('../models/word-list');
    this.weightList = new this.listModel({filter: this.currentScope, count: 10});
    this.weightList.fetch();

    var sugg = require('../models/suggestion');
    // the model to handle suggestions to server
    this.suggestion = new sugg();

    // filter list
    var filterList = require('../models/filter-list');
  },

  render: function() {
    // load up the views with the current scope
    this.barChart = require('../views/bar-chart');
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
    this.renderChartSet([{filter: null, loc: '#all'}], 15);

    var self = this;
    setTimeout(function() {
      // web
      self.renderChartSet([
        {filter: 'JavaScript', loc: '#js'},
        {filter: 'Ruby', loc: '#ruby'},
        {filter: 'PHP', loc: '#php'}
        ], 10);
    }, 500);

    setTimeout(function() {
      // lisp
      self.renderChartSet([
        {filter: 'C', loc: '#c'},
        {filter: 'C++', loc: '#cpp'},
        {filter: 'C#', loc: '#csharpe'}
        ], 8);
    }, 1000);

    setTimeout(function() {
      self.renderChartSet([
        {filter: 'CoffeeScript', loc: '#cs'},
        {filter: 'Rust', loc: '#rust'},
        {filter: 'Bro', loc: '#bro'},
        {filter: 'Java', loc: '#java'}
        ], 5);
    }, 2000);

    // bottom ui
    var filter = new filterView({
      el: '#filter',
      model: this.suggestion
    });
    filter.render();

    var weightChart = new this.barChart({
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
  },

  renderChartSet: function(chartSet, count) {
    var self = this;
    _.each(chartSet, function(obj) {
      var mod = new self.listModel({count: count, filter: obj.filter});
      var chart = new self.barChart({
        model: mod,
        el: obj.loc
      });
      chart.render();
      mod.fetch();
    });

  }

});

