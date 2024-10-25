function init(){

    var w = 200;
    var h = 200;
    var dataset = [10, 20, 30, 40, 23, 50, 12, 34]; // Example dataset
    
    var outerRadius = w / 2;
    var innerRadius = 0;
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Arc generator for drawing pie slices
    var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);
    
    // Pie layout generator to calculate the angles of the slices
    var pie = d3.pie();
    
    // Append an SVG element to the chart div
    var svg = d3.select("#pie")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    
    // Create groups for each slice (arc)
    var arcs = svg.selectAll("g.arc")
                  .data(pie(dataset)) // Pass the dataset to pie layout
                  .enter()
                  .append("g")
                  .attr("class", "arc")
                  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")"); // Center the pie chart
    
    // Append the actual slices (paths) to the groups
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i); // Assign colors to slices
        })
        .attr("d", arc); // Use arc generator to draw the slices
    
    // Append text labels to the center of each slice
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")"; // Place text in the center of each slice
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.data; // Use d.data to access the original value in the dataset
        });
    }
    window.onload = init;
    