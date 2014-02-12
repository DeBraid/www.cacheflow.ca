console.log(" BOOOO YAHHH ");

var data = 
'Category,Total,Under $1000,$1000-$9999,$10000-19999,$20000-99999,100K - $999999,Over $1 Million\n' +
'Music,14744,1434,10935,1709,634,31,1\n' +
'Film & Video,12796,1216,7748,2008,1668,153,3\n' +
'Art,5491,1035,3782,457,203,14,0\n' +
'Publishing,4985,763,3258,588,351,25,0\n' +
'Theater,3502,465,2634,258,137,8,0\n' +
'Games,2822,150,1091,541,763,248,29\n' +
'Design,2433,146,852,458,719,249,9\n' +
'Food,2042,93,1002,528,397,22,0\n' +
'Comics,1703,216,1024,246,187,29,1\n' +
'Fashion,1464,149,816,229,234,35,1\n' +
'Photography,1426,219,936,182,87,1,1\n' +
'Technology,1212,52,385,173,353,238,11\n' +
'Dance,1177,95,976,84,22,0,0\n';

console.log("foo");
console.log(data);
console.log("bar");

/*
var datafail = tributary.datafail;
var datanototal = tributary.nototal;
*/

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

d3.csv("kick.csv", function stacked (error, data){ 

  console.log("baxington");
  console.log(data);
  console.log("amamadndadsf");
  
  
  color.domain(d3.keys(data[0]).filter(function(key){ return key !== "Category" }));
  
  data.forEach(function(d) {
    var y0 = 0;
    d.groups = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.groups[d.groups.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x0.domain(data.map(function(d) { return d.Category; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  
  //********** AXES *******************
  
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


/*


d3.csv("kick.csv", function grouped (error, data){ 
  
  var ranges = d3.keys(data[0]).filter(function(key) { return key !== "Category"; });

  data.forEach(function(d) {
    d.groups = ranges.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.Category; }));
  x1.domain(ranges).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.groups, function(d) { return d.value; }); })]);

  
  //********** AXES *******************
  
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
      .attr("transform", function(d) { return "translate(" + x0(d.Total) + ",0)"; });

  bars.selectAll("rect")
      .data(function(d) { return d.groups; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });


  //********** LEGEND *******************
  
  var legend = svg.selectAll(".legend")
      .data(ranges.slice().reverse())
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


*/


// ****** SELECT CHART TYPE **********

// grouped(data);

// stacked(data);


/*
function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") grouped();
  else stacked();
}

*/


/*

 data = datanototal // correct for stacked

*/