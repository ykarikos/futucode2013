
// What programming languages have you used this year?

// http://bl.ocks.org/mbostock/4063269
var diameter = 700,
    color = d3.scale.category10();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#chart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var tooltip = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.json("data.json", function(error, root) {
	var node = svg.selectAll(".node")
	    .data(bubble.nodes(root)
	    	.filter(function(d) { return !d.children; }))
	    .enter().append("g")
	    .attr("class", "node")
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	node.on("mouseover", function(d) {
	     	tooltip.transition()
	        	.duration(200)
	        	.style("opacity", .9);
	    	tooltip.html( d.className + ": " + d.value)
	        	.style("left", (d3.event.pageX) + "px")
	        	.style("top", (d3.event.pageY - 28) + "px");
	    })
	    .on("mouseout", function(d) {
	    	tooltip.transition()
	        	.duration(500)
	        	.style("opacity", 0);
	    });	

	node.append("circle")
    	.attr("r", function(d) { return d.r; })
	    .style("fill", function(d) { return color(d.className); });

	node.append("text")
		.attr("dy", ".3em")
    	.attr("text-anchor", "middle")
		.text(function(d) { return d.className.substring(0, d.r / 3); });
});

d3.select(self.frameElement).style("height", diameter + "px");
