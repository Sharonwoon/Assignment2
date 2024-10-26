function init() {
    var dataset = [ // Dataset for the stacked graph
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    var keys = ["apples", "oranges", "grapes"]; // Key each key word and initialize var

    var w = 500;
    var h = 300;
    var margin = { top: 20, right: 20, bottom: 30, left: 40 }; // Even padding around the svg
    
    var xscale = d3.scaleBand()
                   .domain(d3.range(dataset.length))
                   .range([margin.left, w - margin.right]) 
                   .padding(0.1);

    var yscale = d3.scaleLinear()
                   .domain([0, d3.max(dataset, d => d.apples + d.oranges + d.grapes)]) // Y axis value based on max of stacked values
                   .range([h - margin.bottom, margin.top]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);  // Color scheme from d3

    // Stack the data
    var series = d3.stack()
                   .keys(keys)(dataset); // Stack keys and dataset 

    var svg = d3.select("#stacked") // Calling it to body in HTML 
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Create groups for each series
    var groups = svg.selectAll("g")
                    .data(series)
                    .enter()
                    .append("g")
                    .style("fill", function(d) { return color(d.key); }); // Assign color based on the key (for consistency)

    // Add the rects for each stacked value
    groups.selectAll("rect")
          .data(function(d) { return d; })
          .enter()
          .append("rect")
          .attr("x", function(d, i) { return xscale(i); })
          .attr("y", function(d) { return yscale(d[1]); })
          .attr("height", function(d) { return yscale(d[0]) - yscale(d[1]); })
          .attr("width", xscale.bandwidth());

    // Add dots for legend
    svg.selectAll("mydots")
       .data(keys)
       .enter()
       .append("circle")
       .attr("cx", 20) // Position of dots horizontally
       .attr("cy", function(d,i){ return 50 + i*25}) // Position of dots vertically
       .attr("r", 7)
       .style("fill", function(d){ return color(d)}) // Use the same color scheme based on key

    // Add labels for the legend
    svg.selectAll("mylabels")
       .data(keys)
       .enter()
       .append("text")
       .attr("x", 60)
       .attr("y", function(d,i){ return 50 + i*25}) // Position of labels vertically
       .style("fill", function(d){ return color(d)}) // Use the same color scheme based on key
       .text(function(d){ return d})
       .attr("text-anchor", "left")
       .style("alignment-baseline", "middle");
}

window.onload = init;
