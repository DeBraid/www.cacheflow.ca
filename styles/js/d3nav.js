var arcs = [
        {
          "id": 1,
          "innerRadius": 100,
          "outerRadius": 150,
          "x": 45,
          "dy": 45,
          "text": "About",
          "url": "https://dbtest-palucu.backliftapp.com/cv" 
        },
        {
          "id": 2,
          "innerRadius": 155,
          "outerRadius": 210,
          "x": 45,
          "dy": -15,
          "text": "Github",
          "url": "https://github.com/DeBraid"
        },
        {
          "id": 3,
          "innerRadius": 215,
          "outerRadius": 265,
          "x": 45,
          "dy": -75,
          "text": "Contact",
          "url": "mailto:de.braid@gmail.com"
        }
  ];

// constats and set up
var height = 300, 
    width = 300;

var svgNav = d3.select("#svg-nav").append("svg")
  .attr("width", width)
  .attr("height", height);

var canvas = svgNav
  .attr({"width": width, "height": height})
  .append("g")
  .attr("transform", "translate(0,300)");

function drawNav(){ 
  
    // arcs default settings - inner and outer radii, start and end angle
    var arc = d3.svg.arc()
      .innerRadius(100)
      .outerRadius(150)
      .startAngle(0)
      .endAngle(function(t) { return t * 2 * Math.PI / 4; });


    // text paths
    canvas.append("defs").append("path")
      .attr("id", "text-path")
      .attr("d", arc(1));

    canvas.selectAll("path.arc").data(arcs)
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("id", function(d, i) { return "path" + (i+1); })
      .transition()
      .duration(function(d, i) { return 6000 - i * 2000; })
      .attrTween("d", function(d, i) {
          return d3.svg.arc()
              .innerRadius(d.innerRadius)
              .outerRadius(d.outerRadius)
              .startAngle(0)
              .endAngle(function(t) { return t * 2 * Math.PI / 4; });
      });

      // clip paths and text
    canvas.selectAll("clipPath").data(arcs)
      .enter().append("clipPath")
      .attr("id", function(d, i) { return "text-clip" + i; })
      .append("use")
      .attr("xlink:href", function(d, i) { return "#path" + (i+1); });

    canvas.selectAll("text").data(arcs)
      .enter()
      .append("a")
      .attr("xlink:href", function (d) { return d.url; }).attr("target", "_blank")
      .append("text")
      .attr("clip-path", function(d, i) { return "url(#text-clip" + i + ")"; })
      .attr("x", function(d) { return d.x; })
      .attr("dy", function(d) { return d.dy; })
      .append("textPath")
      .attr("xlink:href", "#text-path")
      .attr("id", function(d, i){ return "nav-txt" + (i+1); })
      .text(function(d) { return d.text; });
 
};


// hide this element for tablets and mobile
var screenWidth = window.innerWidth || document.documentElement.clientWidth;
if (screenWidth > 1150) { drawNav(); }

// scrolling animations
$(document).scroll(function () {

    var y = $(this).scrollTop();
    
    if (y < 400 || y > $(document).height() - 1000) 
    {
      $('#svg-nav').fadeIn();
    } 
    else 
    {
      $('#svg-nav').fadeOut(1250);
    }    
});

// $('#nav-txt2').onClick(function {
//   $(this).text("foobar")) ;
// };


