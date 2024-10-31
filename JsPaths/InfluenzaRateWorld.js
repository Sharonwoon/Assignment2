function init() { 
    // Pie Chart Code
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

    var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);

    var pie = d3.pie()
                .value(d => d.cases);

    var svg = d3.select("#pie")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    var arcs = svg.selectAll("g.arc")
                  .data(pie(dataset))
                  .enter()
                  .append("g")
                  .attr("class", "arc");

    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc)
        .style("cursor", "pointer")
        .style("stroke", "#fff")
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", d3.arc().outerRadius(outerRadius + 10).innerRadius(innerRadius));
            
            tooltip.html(d.data.country + ": " + d.data.cases)
                   .style("opacity", 1)
                   .style("left", (event.pageX + 10) + "px")
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
              .attr("d", arc);

            tooltip.style("opacity", 0);
        });

    var tooltip = d3.select("body").append("div")   
                    .attr("class", "tooltip")              
                    .style("opacity", 0);

    // Map Code---------------------------------------------------------------------------------------------------------------------------
    var w = 800;
    var h = 750;

    var projection = d3.geoMercator()
                        .translate([w / 2, h / 2])
                        .scale(130);

    var path = d3.geoPath().projection(projection);

    var color = d3.scaleQuantize().range(d3.schemePurples[5]);

    var svgMap = d3.select("#Map")
                   .append("svg")
                   .attr("width", w)
                   .attr("height", h)
                   .style("border", "2px solid #333") // Adds a border directly around the SVG
                   .style("border-radius", "8px")     // Optional rounded corners for the border
                   .call(
                       d3.zoom()
                         .scaleExtent([1, 8])
                         .on("zoom", zoomed)
                   )
                   .append("g");

    var tooltipMap = d3.select("#tooltip");

    d3.json("GeoJsonWorldMap.json").then(function(json) {
        svgMap.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("fill", "#ccc")
              .on("mouseover", function(event, d) {
                  tooltipMap.transition()
                            .duration(200)
                            .style("opacity", 0.9);
                  tooltipMap.html(d.properties.LGA_name || "Unknown Region")
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
              })
              .on("mouseout", function() {
                  tooltipMap.transition()
                            .duration(500)
                            .style("opacity", 0);
              });
    });

    function zoomed(event) {
        svgMap.attr("transform", event.transform);
    }
}

window.onload = init;