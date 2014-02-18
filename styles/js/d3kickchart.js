var margin = {top: 20, right: 50, bottom: 100, left: 75},
    width = 825 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([25, width], 0.1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98ABC5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#chart-svg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


console.log("foobar");

  var stacked = d3.csv("kick.csv", function (error, data){ 

      color.domain(d3.keys(data[0]).filter(function(key){ return key !== "Category" }));
      
      data.forEach(function(d) {
        var y0 = 0;
        d.groups = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.groups[d.groups.length - 1].y1;
      });

      data.sort(function(a, b) { return b.total - a.total; });

      x0.domain(data.map(function(d) { return d.Category; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);

      
      //********** AXES ************
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text").style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-45)" 
                    });
      
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(20,0)")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr({"x": -150, "y": -70})
          .attr("dy", ".75em")
          .style("text-anchor", "end")
          .text("# of campaigns");

      //********** BARS *******************
      var bars = svg.selectAll(".bars")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x0(d.Category) + ",0)"; });

      bars.selectAll("rect")
          .data(function(d) { return d.groups; })
        .enter().append("rect")
          .attr("width", x0.rangeBand())
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .style("fill", function(d) { return color(d.name); });


      //********** LEGEND *******************
      var legend = svg.selectAll(".legend")
          .data(color.domain().slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

    });


console.log("backzies");
