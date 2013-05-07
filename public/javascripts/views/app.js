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
    this.weightList = new listModel({type: 'weight', filter: this.currentScope});
    this.countList = new listModel({type: 'count', filter: this.currentScope});
    this.weightList.fetch();
    this.countList.fetch();

    // filter list
    var filterList = require('../models/filter-list');
  },

  render: function() {
    // load up the views with the current scope
    var barChart = require('../views/bar-chart');
    var pieChart = require('../views/pie-chart');
    var filterView = require('../views/filter');

    var filter = new filterView({
      el: '#filter'
    });
    filter.render();

    var weightChart = new barChart({
      model: this.weightList,
      el: '#weight'
    });
    weightChart.render();

    var countChart = new barChart({
      model: this.countList,
      el: '#count'
    });
    countChart.render();
  }

});

