// pie chart
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  template: require('pie-chart'),

  initialize: function() {

  },

  render: function() {
    $(this.el).html(this.template({name: 'a', type: 'desc'}));

    var self = this;
    this.model.on('sync', function() {
      self.drawChart($(self.el).find('.chartLocation')[0]);
    });
  },

  drawChart: function(loc) {
    var colors = [
        '#FF9900',
        '#DD7700',
        '#6699CC',
        '#E6E6CC',
        '#CDBFAC',
        '#9C9284'
    ];

    var data = this.model.get('list');

    var width = 300;
    var height = 300;
    var radius = 100;

    var labelPadding = 1.6;

    var margin = {top: 20, right: 20, bottom: 30, left: 40};

    var pie = d3.layout.pie().sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 50)
        .outerRadius(radius - 20);

    var svg = d3.select(loc).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var g = svg.selectAll('.arc')
        .data(pie(_.pluck(data, 'count'))).enter();

    this.path = g.append('path')
                .attr('class', 'arc')
                .attr('fill', function(d, i) { return colors[i]; })
                .attr('d', arc)
                .each(function(d) { this._current = d; });

    this.labels = g.append('text').text(function(d, i) {
      return data[i].word;
    })
    .attr('text-anchor', 'middle')
    .attr('transform', function(d) {
      var loc = arc.centroid(d);
      return 'translate(' + labelPadding * loc[0] + ',' + labelPadding * loc[1] + ') ';
             //'rotate(' + 360 * Math.sin(loc[0]) / Math.cos(loc[1]) + ')';
    }).each(function(d) { this._currentD = d; });

    var self = this;
    this.model.on('change:list', function() {
      var orgData = self.model.get('list');
      data = pie(_.pluck(orgData, 'count'));
      self.path = self.path.data(data);

      self.path.transition().duration(1000).attrTween('d', function(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      });

      self.labels.transition().duration(1000).attrTween('transform', function(a, j) {
        var loc = arc.centroid(this._currentD);
        var startRote = 'translate(' + labelPadding * loc[0] + ',' + labelPadding * loc[1] + ')';
        // figure out where we will end up
        loc = arc.centroid(data[j]);
        var endRote = 'translate(' + labelPadding * loc[0] + ',' + labelPadding * loc[1] + ')';
        return d3.interpolateString(startRote, endRote);
      }).text(function(d, i) {
        return orgData[i].word;
      });
    });

    return this;
  }

});
