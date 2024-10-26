function init() { // combine init() for both to ensure both runs smoothly 
    // Pie chart code
    var w = 200;
    var h = 200;
    var dataset = [10, 20, 30, 40, 23, 50, 12, 34];
    var outerRadius = w / 2;
    var innerRadius = 0;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);
    var pie = d3.pie();

    var svgPie = d3.select("#pie")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

    var arcs = svgPie.selectAll("g.arc")
                     .data(pie(dataset))
                     .enter()
                     .append("g")
                     .attr("class", "arc")
                     .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.data;
        });

    // ----------------------------------------------------------Map chart----------------------------------------------------------------------------------------------------------
    var w = 500;
    var h = 400;

    var projection = d3.geoMercator()
                        .center([145, -36.5])
                        .translate([w / 2, h / 2])
                        .scale(3000);

    var path = d3.geoPath().projection(projection);

    var color = d3.scaleQuantize().range(d3.schemePurples[5]);

    var svgMap = d3.select("#Map")
                   .append("svg")
                   .attr("width", w)
                   .attr("height", h)
                   .attr("fill", "Blue");

    var tooltip = d3.select("#tooltip");

    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        color.domain([
            d3.min(data, function(d) { return d.unemployed; }),
            d3.max(data, function(d) { return d.unemployed; })
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

            svgMap.selectAll("path")
                  .data(json.features)
                  .enter()
                  .append("path")
                  .attr("d", path)
                  .style("fill", function(d) {
                      var value = d.properties.value;
                      return value ? color(value) : "#ccc";
                  });

            d3.csv("VIC_city.csv").then(function(cityData) {
                svgMap.selectAll("circle")
                      .data(cityData)
                      .enter()
                      .append("circle")
                      .attr("cx", function(d) {
                          return projection([d.lon, d.lat])[0];
                      })
                      .attr("cy", function(d) {
                          return projection([d.lon, d.lat])[1];
                      })
                      .attr("r", 5)
                      .style("fill", "Black")
                      .style("opacity", 0.75)
                      .on("mouseover", function(event, d) {
                          tooltip.transition()
                                 .duration(200)
                                 .style("opacity", 0.9);
                          tooltip.html(d.place)
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