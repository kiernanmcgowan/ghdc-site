// chart
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  template: require('bar-chart'),

  modelIsFetching: false,

  filter: null,

  initialize: function() {

  },

  render: function() {
    var self = this;

    // draw the area around the chart
    $(this.el).html(this.template({
      title: this.createTitle()
    }));

    this.model.on('change:filter change:type', function() {
      self.updateTitle();
    });

    if (this.model.isLoaded) {
      this.drawChart($(self.el).find('.chartLocation')[0]);
    } else {
      this.modelIsFetching = true;
      this.model.on('sync', this.modelSynced, this);
    }
  },

  createTitle: function() {
    return (this.model.get('filter') || 'All Languages') + ' by ' + this.model.get('type');
  },

  updateTitle: function() {
    this.$el.find('.title').text(this.createTitle());
  },

  modelSynced: function() {
    this.modelIsFetching = false;
    console.log('model loaded');
    this.drawChart($(this.el).find('.chartLocation')[0]);
    // dont need to listen any more
    this.model.off('sync', this.modelSynced);
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
    var height = 200;
    var barPadding = 5;
    var margin = {top: 50, right: 20, bottom: 30, left: 40};

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function(d) { return d.word; }));
    y.domain([d3.min(data, function(d) { return d.count * 0.7; }),
              d3.max(data, function(d) { return d.count * 1; })]);

    var formatAsPercentage = d3.format('s');

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(formatAsPercentage);

    var svg = d3.select(loc).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('g')
        .attr('class', 'axis axis-y')
        .call(yAxis);

    this.bars = svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.word); })
        .attr('width', x.rangeBand())
        .attr('y', function(d) { return y(d.count); })
        .attr('height', function(d) { return height - y(d.count); })
        .style('fill', function(d, i) { return colors[i]; })
        .each(function(d, i) {
          this._currentY = y(d.count);
          this._currentH = height - y(d.count);
        });

      this.labels = svg.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('y', function(d, i) {
          return -1 * (height - y(data[i].count) + 40);
        })
        .attr('transform', function(d, i) {
          //translate(0, -' + (height - y(data[i].count) + 40) + ')
            return 'rotate(-10, 0,' + (-1 * (height - y(data[i].count) + 40)) + ')';
        })
        .each(function(d, i) {
          this._currentY = -1 * (height - y(data[i].count) + 40);
        });

    var self = this;
    this.model.on('change:list', function() {

      var data = self.model.get('list');
      self.bars = self.bars.data(data);

      // update the domain - make sure to cast to num
      y.domain([d3.min(data, function(d) { return d.count * 0.7; }),
                d3.max(data, function(d) { return d.count * 1; })]);

      self.bars.transition().duration(1000).attrTween('height', function(a) {
        var i = d3.interpolate(this._currentH, height - y(a.count));
        this._currentH = i(0);
        return function(t) {
          return i(t);
        };
      }).attrTween('y', function(a) {
        var i = d3.interpolate(this._currentY, y(a.count));
        this._currentY = i(0);
        return function(t) {
          return i(t);
        };
      }).each('end', function(a, i) {
        this._currentH = (height - y(a.count));
        this._currentY = y(a.count);
      });

      self.labels.transition().duration(1000).attrTween('y', function(a, j) {
        var i = d3.interpolate(this._currentY, -1 * (height - y(data[j].count) + 40));
        this._currentY = i(0);
        return function(t) {
          return i(t);
        };
      }).attrTween('transform', function(a, j) {
        var startRote = 'rotate(-10, 0,' + this._currentY + ')';
        // figure out where we will end up
        var endRote = 'rotate(-10, 0,' + (-1 * (height - y(data[j].count) + 40)) + ')';
        return d3.interpolateString(startRote, endRote);
      }).text(function(d, i) {
        return data[i].word;
      }).each('end', function(a, j) {
        this._currentY = (-1 * (height - y(data[j].count) + 40));
      });

      // update the ticks
      svg.selectAll('.axis-y').remove();

      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(formatAsPercentage);

      svg.append('g')
        .attr('class', 'axis axis-y')
        .call(yAxis);

    });

    return this;
  }

});
