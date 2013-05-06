// chart
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({

  initialize: function() {

  },

  render: function() {
    // we need to wait for the model to be loaded
    if (!this.model.isLoaded) {
      // wait till the model is loaded until ready
      var self = this;
      this.model.on('sync', function() {
        self.render();
      });
      return this;
    }

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
    var margin = {top: 20, right: 20, bottom: 30, left: 40};

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function(d) { return d.word; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var svg = d3.select(this.el).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        //.attr('transform', 'rotate(-90)');

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
        //.append('text')
        //.attr('transform', 'rotate(-90)')
        //.attr('y', 6)
        //.attr('dy', '.71em')
        //.style('text-anchor', 'end')
        //.text('Frequency');

    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.word); })
        .attr('width', x.rangeBand())
        .attr('y', function(d) { return y(d.count); })
        .attr('height', function(d) { return height - y(d.count); })
        .style('fill', function(d, i) { return colors[i]; });
  }

});
