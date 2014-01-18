
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
	["languagesCount", "languagesPerMessage", "messagesCount"].forEach(function(id) {
		d3.select("#" + id).text(root[id]);
	});

	root.children.push({ className: "futulogo", value: 1});
	var node = svg.selectAll(".node")
	    .data(bubble.nodes(root)
	    	.filter(function(d) { return !d.children; }))
	    .enter().append("g")
	    .attr("class", "node")
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	
	node.filter(function(d) { return d.className != "futulogo"})
		.on("mouseover", function(d) {
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

	node.filter(function(d) { return d.className != "futulogo"})
		.append("circle")
    	.attr("r", function(d) { return d.r; })
	    .style("fill", function(d) { return color(d.className); });

	node.filter(function(d) { return d.className != "futulogo"})
		.append("text")
		.attr("dy", ".3em")
    	.attr("text-anchor", "middle")
		.text(function(d) { return d.className.substring(0, d.r / 3); });

	node.filter(function(d) { return d.className == "futulogo"})
		.attr("transform", function(d) {
			var scale = d.r * 0.0004;
			return "translate(" + (d.x-d.r) + "," + (d.y+d.r) + ") scale(" + scale +",-" + scale + ")";
		}).append("svg:a")
		.attr("xlink:href", "http://www.futurice.com")
		.attr("fill", "#4c9018")
		.append("path")
		.attr("d", "M2295 4963 c-147 -17 -273 -38 -372 -63 -610 -149 -1141 -523 -1486 -1045 -464 -702 -543 -1584 -211 -2363 229 -536 656 -984 1189 -1247 329 -163 625 -237 880 -222 229 14 369 86 437 225 30 61 33 74 33 162 0 85 -3 101 -30 154 -59 118 -157 197 -450 364 -281 160 -400 248 -519 384 -120 136 -235 341 -290 515 -53 170 -67 265 -73 485 -3 114 -2 223 1 242 l7 36 72 0 c131 0 332 -42 474 -99 230 -91 426 -244 595 -461 204 -263 298 -497 343 -853 8 -65 15 -139 16 -165 l1 -47 14 55 c85 320 201 527 369 655 268 204 590 257 890 144 l58 -21 -6 -117 c-8 -179 -61 -330 -162 -461 -112 -146 -227 -217 -562 -351 -216 -85 -334 -146 -418 -216 -113 -93 -155 -175 -155 -302 0 -93 27 -158 88 -213 72 -65 187 -78 337 -39 511 132 1058 608 1343 1167 343 676 389 1451 127 2120 -190 483 -523 892 -961 1180 -408 269 -880 407 -1379 403 -93 -1 -183 -4 -200 -6z")
		
	d3.select("#loading").remove();
});

d3.select(self.frameElement).style("height", diameter + "px");

