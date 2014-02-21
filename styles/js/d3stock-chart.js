
// helpers and constants
var margin = {"top": 50, "right": 100, "bottom": 50, "left": 50};
var width = 930 - margin.right - margin.left;
var height = 582 - margin.top - margin.bottom;
var timeFormat = d3.time.format("%c");


d3.json('../styles/js/stockdata.json', function(data) {
  
  var dataset = data.sample2;

  console.log(dataset);
  console.log("check data above Foo BAR BAZ");

  dataset.forEach(function(d) { d.time = new Date(d.time * 1000); });

var X = width/dataset.length*0.25;
var bisectDate = d3.bisector(function(d) { return d.time; }).left;

// find data range
var xDomain = d3.extent(dataset, function (d, i){ return d.time; });
var yMin = d3.min(dataset, function(d){ return Math.min(d.low); });
var yMax = d3.max(dataset, function(d){ return Math.max(d.high); });

// scales, add 10pc padding to x-domain
var xScale = d3.time.scale()
  .domain(xDomain);

xScale.domain([-0.05,1.05].map(xScale.invert))
  .range([margin.left, width - margin.right]);

var yScale = d3.scale.linear()
  .domain([yMin, yMax])
  .range([height - margin.top, margin.bottom]);

// set up axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
  .ticks(5)
  .tickPadding(5);
// .tickFormat(timeFormat)

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("right")
  .ticks(5)
    .tickFormat(function(d) { return "$" + d});

// set up chart types
var area = d3.svg.area()
    .x(function(d){ return xScale(d.time); })
    .y0(height- margin.bottom)
    .y1(function(d){ return yScale(d.close); });

var line = d3.svg.line().interpolate("basis")
    .x(function(d){ return xScale(d.time); })
    .y(function(d){ return yScale(d.close); });

// create svg container and offset
var canvas = d3.select("#stock-chart").append("svg")
  .attr({"width": width, "height": height})
  .append("g")
  .attr("transform", "translate(" + margin.top/2 + "," + margin.left/2 + ")");

// grid plot
var grid = canvas.append("svg:rect")
    .attr({
      "width": width - margin.right - margin.left,
      "height": height - margin.bottom - margin.top,
      "class": "plot",
      "transform": "translate(" + margin.top + "," + margin.bottom + ")"
    });

grid.append("g").append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", 300)
        .attr("height", 300);

canvas.selectAll("line.horizontalGrid").data(yScale.ticks(5))
    .enter()
    .append("line")
    .attr({
      "class":"horizontalGrid",
      "x1" : margin.left,
      "x2" : width - margin.right,
      "y1" : function(d){ return yScale(d);},
      "y2" : function(d){ return yScale(d);}
    });

canvas.append("text").text("$GOOG")
.attr({"x": width*0.06, "dy": "1.5em" })
  .style("font-size", "30")

// drop down menu
var chartOptions = ["candle", "line", "area"];

var dropDown = d3.select("#stock-chart")
    .append("foreignObject")
    .attr({
      "height": 100,
      "width": 200,
      "transform": "translate(" + (width*0.645) + "," + margin.top*0.6 + ")"
    })
    .append("xhtml:select")
    .attr("id", "drop-down")
    .selectAll("option")
    .data(chartOptions)
    .enter()
    .append("option")
    .text(function(d) { return d;})
    .attr("value", function(d){ return d; });

// big daddy - draw the chart
function chartDraw () {
    // chart options by type
    var type = {
      
      candle: function(){
         
          canvas.selectAll("line.candle")
            .data(dataset)
            .enter()
            .append("svg:line")
            .attr({
              "class": "candle alt-view",
              "x1": function(d,i) { return xScale(d.time) - X*0.5; },
              "x2": function(d,i) { return xScale(d.time) - X*0.5; },
              "y1": function(d,i) { return yScale(d.high); },
              "y2": function(d,i) { return yScale(d.low); },
              "stroke": "black" 
            });    
          
          canvas.selectAll("rect.candle")
            .data(dataset)
            .enter()
            .append("svg:rect")
            .attr({
              "class": "candle alt-view",
              "width": function(d){ return X},
              "x": function(d,i) { return xScale(d.time) - X; },
              "y": function(d,i) { return yScale(Math.max(d.open, d.close)); },
              "height": function(d,i) { return yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)); },
              "fill": function (d) { return d.open > d.close ? "#dc432c" : "#0CD1AA" },
              "stroke": "black"
            });
    
        },
        
      line: function(){ 
       
          canvas.append("path")
            .datum(dataset)
            .attr("class", "line alt-view")
            .attr("d", line); 
      },
    
      area: function (){
          
    
          canvas.append("linearGradient")
            .attr("id", "temperature-gradient")
          
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yScale(yMin))
            .attr("x2", 0).attr("y2", yScale(yMax))
            .selectAll("stop")
            .data([
              {offset: "20%", color: "#DC432C"},
              {offset: "45%", color: "#0CD1AA"}
            ])
            .enter().append("stop")
              .attr("offset", function(d) { return d.offset; })
              .attr("stop-color", function(d) { return d.color; });
         
          canvas.append("path")
            .datum(dataset)
            .attr("class", "area alt-view")
            .attr("d", area);
        }
    }; 
  
    // default chart
    type.candle();  

    d3.select("#drop-down")
       .on("change", function () { 
              
          d3.selectAll(".alt-view").remove();
          
          selected = this.value;
          
          if (selected == "line") { return type.line(); }
          else if (selected == "area") { return type.area(); }
          else if (selected == "candle") { return type.candle(); }
        }); 

    // draw axes
    canvas.append('g').attr("class","x axis").call(xAxis)
        .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')');
    
    canvas.append('g').attr("class","y axis").call(yAxis)
        .attr('transform', 'translate(' + (width - margin.right) + ', 0)');

}

chartDraw();

// add cross hairs and floating value on axis
var focus = canvas.append("g")
        .attr("class", "focus")
        .style("display", "none");

var focusTextOpen = canvas.append("g")
        .style("display", "none")
        .attr("class","focus");

    focusTextOpen.append("text")
        .attr({"x": width*0.25, "dy": "2.5em" });


var focusTextClose = canvas.append("g")
        .attr("class","focus")
        .style("display", "none");

    focusTextClose.append("text")
        .attr({"x": width*0.4, "dy": "2.5em" });

    // horizontal crosshair 
    focus.append("line")
          .attr({
            "x1": -width,
            "y1": 0,
            "x2": width,
            "y2": 0,
            "class": "h"
          });

    // vertical crosshair    
    focus.append("line")
            .attr({
              "x1": 0,
              "y1": -height,
              "x2": 0,
              "y2": height,
              "class": "v"
            });
    
    canvas.append("rect")
        .attr({"class": "overlay" , "width": width , "height": height})
        .on({
          "mouseover": function() { focus.style("display", null);   focusTextOpen.style("display", null);  focusTextClose.style("display", null); },
          "mouseout":  function() { focus.style("display", "none"); focusTextOpen.style("display", "none"); focusTextClose.style("display", "none"); }, 
          "mousemove": mousemove
        });
  

function mousemove() {
  var x0 = xScale.invert(d3.mouse(this)[0]),
        i = bisectDate(dataset, x0, 1),
        d0 = dataset[i-1],
        d1 = dataset[i],
        d =  d1.date - x0 > x0 - d0.date ? d1 : d0;
  
  focus.attr("transform", "translate(" + (d3.mouse(this)[0] -4) + "," + (d3.mouse(this)[1]) + ")");
    
    focus.select(".h").attr({"x1": margin.left - d3.mouse(this)[0], "x2": width - margin.right - d3.mouse(this)[0]});
    focus.select(".v").attr({"y1": margin.top - d3.mouse(this)[1], "y2": height - margin.bottom - d3.mouse(this)[1]});

  
    focusTextClose.select("text").text("Close: $" + d.close);
    focusTextOpen.select("text").text("Open: $" + d.open);

}


});



  


