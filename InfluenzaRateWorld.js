function init() {
    //Width and height
    var w = 500;
    var h = 400;

    var projection = d3.geoMercator()
                        .center([145, -36.5])
                        .translate([w / 2, h / 2])
                        .scale(3000);

    // set up the paths
    var path = d3.geoPath()
                .projection(projection);

    var color = d3.scaleQuantize()
                .range(d3.schemePurples[5]);

    var svg = d3.select("#Map")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "Blue");

    var tooltip = d3.select("#tooltip");  // Reference to the tooltip div

    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        color.domain([
            d3.min(data, function (d) { return d.unemployed; }),
            d3.max(data, function (d) { return d.unemployed; })
        ]);

        d3.json("https://raw.githubusercontent.com/Yozzyyy/Data-visualisation/main/Data%20Visualisation/8.0Task/LGA_VIC.json").then(function(json) {
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].LGA;
                var dataValue = parseFloat(data[i].unemployed);

                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.LGA_name;

                    if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }

            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                    var value = d.properties.value;
                    return value ? color(value) : "#ccc";
                });

            d3.csv("VIC_city.csv").then(function(cityData) {
                svg.selectAll("circle")
                    .data(cityData)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0]; //uses coordinates for CX
                    })
                    .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1]; //uses coordinates for CY
                    })
                    .attr("r", 5)
                    .style("fill", "Black")
                    .style("opacity", 0.75)
                    .on("mouseover", function(event, d) {
                        tooltip.transition()
                               .duration(200)
                               .style("opacity", 0.9);
                        tooltip.html(d.place) // Display the "place" name from the CSV
                               .style("left", (event.pageX + 5) + "px")
                               .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mousemove", function(event) {
                        tooltip.style("left", (event.pageX + 5) + "px")
                               .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.transition()
                               .duration(500)
                               .style("opacity", 0);
                    });
            });
        });
    });
}
window.onload = init;
