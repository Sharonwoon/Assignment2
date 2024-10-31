function init() { // combine init() for both to ensure both runs smoothly 
    // Pie chart code
    
    var w = 300;
    var h = 300;
    var dataset = [
        { country: "Afghanistan", cases: 137 },
        { country: "Albania", cases: 55 },
        { country: "Algeria", cases: 260 },
        { country: "Argentina", cases: 117 },
        { country: "Armenia", cases: 17 },
        { country: "Australia", cases: 1510 },
        { country: "Austria", cases: 411 },
        { country: "Azerbaijan", cases: 3 },
        { country: "Bahrain", cases: 449 },
        { country: "Bangladesh", cases: 34 },
        { country: "Barbados", cases: 187 },
        { country: "Belarus", cases: 42 }
    ];
    
    var outerRadius = w / 2;
    var innerRadius = 0;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Arc generator for drawing pie slices
    var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);

    // Pie layout generator to calculate the angles of the slices
    var pie = d3.pie()
                .value(d => d.cases);

    // Append an SVG element to the chart div
    var svg = d3.select("#pie")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")"); // Center the pie chart

    // Create groups for each slice (arc)
    var arcs = svg.selectAll("g.arc")
                  .data(pie(dataset))
                  .enter()
                  .append("g")
                  .attr("class", "arc");

    // Append the actual slices (paths) to the groups with hover effects
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i); // Assign colors to slices
        })
        .attr("d", arc)
        .style("cursor", "pointer")
        .style("stroke", "#fff") // Adds separation lines
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", d3.arc().outerRadius(outerRadius + 10).innerRadius(innerRadius)); // Expands slice on hover
            
            tooltip.html(d.data.country + ": " + d.data.cases) // Display country and cases count
                   .style("opacity", 1) // Show tooltip
                   .style("left", (event.pageX + 10) + "px") // Position tooltip
                   .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arc); // Shrinks back slice on mouseout

            tooltip.style("opacity", 0); // Hide tooltip
        });

    // Tooltip for displaying the country and cases on hover
    var tooltip = d3.select("body").append("div")   
                    .attr("class", "tooltip")               
                    .style("position", "absolute")
                    .style("text-align", "center")
                    .style("padding", "6px")
                    .style("font-size", "12px")
                    .style("background", "lightgray")
                    .style("border", "1px solid #333")
                    .style("border-radius", "4px")
                    .style("pointer-events", "none")
                    .style("opacity", 0);
    // ----------------------------------------------------------Map chart----------------------------------------------------------------------------------------------------------
    var w = 900;
    var h = 750;
    
    // Adjust the projection for a global map view
    var projection = d3.geoMercator()
                        .translate([w / 2, h / 2])
                        .scale(130); // Adjust scale to fit a world map
    
    var path = d3.geoPath().projection(projection);
    
    var color = d3.scaleQuantize().range(d3.schemePurples[5]);
    
    var svgMap = d3.select("#Map")
                   .append("svg")
                   .attr("width", w)
                   .attr("height", h)
                   .attr("fill", "Green");
    
    var tooltip = d3.select("#tooltip");
    
    d3.json("GeoJsonWorldMap.json").then(function(json) {
        svgMap.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("fill", "#ccc")  // Default color for countries
              .on("mouseover", function(event, d) {
                  tooltip.transition()
                         .duration(200)
                         .style("opacity", 0.9);
                  tooltip.html(d.properties.LGA_name || "Unknown Region")
                         .style("left", (event.pageX + 5) + "px")
                         .style("top", (event.pageY - 28) + "px");
              })
              .on("mouseout", function() {
                  tooltip.transition()
                         .duration(500)
                         .style("opacity", 0);
              });
    
        // Add any additional layers or data (e.g., city circles) here if needed
    });
}

window.onload = init;