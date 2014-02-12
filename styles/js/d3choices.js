    var links = [{
        source: "Act",
        target: "Adapt",
        type: "licensing",
        label: "Label for A"
    }, {
        source: "Adapt",
        target: "Plan",
        type: "licensing",
        label: "Label for B"
    }, {
        source: "Plan",
        target: "Act",
        type: "licensing",
        label: "Label for C"
    }];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target
        });
    });

    var w = 460,
        h = 300
        markerWidth = 6,
        markerHeight = 6,
        cRadius = 40, 
        refX = cRadius + (markerWidth * 2),
        refY = -Math.sqrt(cRadius),
        drSub = cRadius + refY;

    function drawNodes(){ 

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([w, h])
            .linkDistance(180)
            .charge(-10)
            .on("tick", tick)
            .start();

        var svg = d3.select("#node-container").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg-balls");   


        
        // Per-type markers, as they don't inherit styles.
        svg.append("svg:defs").selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", refX)
            .attr("refY", refY)
            .attr("markerWidth", markerWidth)
            .attr("markerHeight", markerHeight)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        svg.append("svg:text")
            .attr("x", 10)
            .attr("y", 20)
            .text("Drag a Circle");    

        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", function (d) {
            return "link " + d.type;
        })
            .attr("marker-end", function (d) {
            return "url(#" + d.type + ")";
        });


        var circle = svg.append("svg:g").selectAll("circle")
            .data(force.nodes())
            .enter().append("svg:circle")
            .attr("r", cRadius)
            .attr("id", function(d){ return d.name; })
            .call(force.drag)
            .on({
                "mouseenter": txtResize, 
                "mouseleave": txtRestore
            });

        var text = svg.append("svg:g").selectAll("g")
            .data(force.nodes())
            .enter().append("svg:g");

        // A copy of the text with a thick white stroke for legibility.
        text.append("svg:text")
            .attr("x", function(d) { return -4 * (d.name).length })
            .attr("y", ".51em")
            .attr("class", "shadow")
            .text(function (d) {
            return d.name;
        });

        text.append("svg:text")
            .attr("x", function(d) { return -4 * (d.name).length })
            .attr("y", ".51em")
            .text(function (d) {
            return d.name;
        });
        

        // Use elliptical arc path segments
        function tick() {
            path.attr("d", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = (d.target.y - d.source.y),
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + d.source.x + "," + d.source.y + "A" + (dr - drSub) + "," + (dr - drSub) + " 0 0,1 " + d.target.x + "," + d.target.y;
            });

            circle.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        };
    };


    $("#headerBG").on("mouseenter", function(){
            if ( $("#svg-balls").length < 1 ) 
            { 
                setTimeout(drawNodes, 1000);
            }
    });


    function txtResize() {

        var clicked = this.id;
        console.log(clicked);

        if (clicked === "Plan" || clicked === "Adapt" || clicked === "Act" ) 
        {
            $("#" + clicked + "Text").animate({"opacity": "1"}, 200);
        }
    };

    function txtRestore() {
        $("#PlanText, #AdaptText, #ActText").css("opacity", "0.2");
    };
