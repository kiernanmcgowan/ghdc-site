// app-view.js
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  el: 'body',

  currentScope: 'all',

  initialize: function() {
    // set up the socket.io sync layer
    require('../utils/sync');

    // now load our data - stay in full scope
    var listModel = require('../models/word-list');
    this.weightList = new listModel({count: false, scope: this.currentScope});
    this.countList = new listModel({count: true, scope: this.currentScope});
    this.weightList.fetch();
    this.countList.fetch();
  },

  render: function() {
    // load up the views with the current scope
    var barChart = require('../views/bar-chart');

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

