var h = 275,
    w = 300;

var svg = d3.select("#svg-arrow").append("svg")
  .attr("width", w)
  .attr("height", h);

var stem = svg.append("rect")
      .attr({
            "height": "125",
            "width": "50",
            "x": "100",
            "y": "5",
            "class": "arrow",
            "id": "stem"
      });


var arrow = svg.append("path")
      .attr({
            "class": "arrow", 
            "d": function(d) { return 'M 50 130 L 200 130 L 125 240 z'; }
      });

d3.selectAll("#svg-arrow, .arrow, #arrow-cont")
      .on({
          "mouseenter": function(d,i) 
            { 
              stem.transition().duration(500).attr('y',130),
                
              arrow.transition().duration(500).attr("d", function(d) { return 'M 50 250 L 200 250 L 125 300 z';}),
                
              d3.selectAll(".arrow").style({"fill": "tomato", "stroke": "tomato"}) 
            },

          "mouseleave": function(d,i) 
            { 
              stem.transition().duration(1250).attr('y',70),
                
              arrow.transition().duration(1250).attr("d", function(d) { return 'M 50 160 L 200 160 L 125 240 z';}),
              
              d3.selectAll(".arrow").style({"fill": "#CCE5FF", "stroke": "#333"}) 
            },

          "click": function()
            { 
              
                  $('html, body').animate({
                      
                      scrollTop: $("#devocracy").offset().top
                  
                  }, 1000);
            }
      });
   