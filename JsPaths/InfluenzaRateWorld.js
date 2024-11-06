function init() {
    // Pie Chart Setup
    const margin = 20;
    const w = 400;
    const h = 400;
    const outerRadius = w / 2 - margin;
    const innerRadius = 0;
    const maxDisplay = 8;
    let displayLimit = maxDisplay;

    const colorPie = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);
    const arcHover = d3.arc().outerRadius(outerRadius + 10).innerRadius(innerRadius);
    const pie = d3.pie().value(d => d.cases);

    const svg = d3.select("#pie")
                  .append("svg")
                  .attr("width", w + margin * 2)
                  .attr("height", h + margin * 2)
                  .append("g")
                  .attr("transform", `translate(${outerRadius + margin}, ${outerRadius + margin})`);

    const tooltipPie = d3.select("#pie-tooltip");

    let data = [];

    function updateChart() {
        const displayData = data.slice(0, displayLimit);

        const arcs = svg.selectAll("g.arc")
                        .data(pie(displayData), d => d.data.country);

        const newArcs = arcs.enter()
                            .append("g")
                            .attr("class", "arc");

        newArcs.append("path")
               .attr("fill", (d, i) => colorPie(i))
               .attr("d", arc)
               .style("cursor", "pointer")
               .style("stroke", "#fff")
               .style("stroke-width", "2px")
               .on("mouseover", (event, d) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr("d", arcHover);

                    tooltipPie.html(`${d.data.country}: ${d.data.cases}`)
                        .style("opacity", 1)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 30}px`);  // Adjusted for more precise positioning
                })
                .on("mousemove", (event) => {
                    tooltipPie.style("left", `${event.pageX-200}px`)
                              .style("top", `${event.pageY-500}px`);  // Adjusted for more precise positioning
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("d", arc);

                    tooltipPie.style("opacity", 0);
                });

        arcs.exit().remove();
    }

    d3.csv("InfluenzaRateCountry.csv").then(csvData => {
        data = csvData.map(d => ({
            country: d.Country,
            cases: +d["Influenza positive"]
        }));
        updateChart();
    });

    d3.select("#addData").on("click", () => {
        if (displayLimit < data.length) {
            displayLimit++;
            updateChart();
        }
    });

    d3.select("#removeData").on("click", () => {
        if (displayLimit > 1) {
            displayLimit--;
            updateChart();
        }
    });

    // Map Setup
    const mapWidth = 800;
    const mapHeight = 750;
    const projection = d3.geoMercator().translate([mapWidth / 2, mapHeight / 2]).scale(130);
    const path = d3.geoPath().projection(projection);
    const colorMap = d3.scaleQuantize().range(d3.schemePurples[5]);

    const svgMap = d3.select("#Map")
                     .append("svg")
                     .attr("width", mapWidth)
                     .attr("height", mapHeight)
                     .call(d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => svgMap.attr("transform", event.transform)))
                     .append("g");

    const tooltipMap = d3.select("#map-tooltip");

    Promise.all([d3.json("GeoJsonWorldMap.json"), d3.csv("InfluenzaRateCountry.csv")]).then(([json, csvData]) => {
        const influenzaData = {};
        csvData.forEach(d => { influenzaData[d.Country_Code] = +d.Influenza_Rate; });
        colorMap.domain(d3.extent(csvData, d => +d.Influenza_Rate));

        svgMap.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", d => {
                const rate = influenzaData[d.properties.iso_a3];
                return rate ? colorMap(rate) : "#e0e0e0";
            })
            .style("stroke", "#333")
            .style("stroke-width", "0.5px")
            .on("mouseover", function(event, d) {
                const countryName = d.properties.name;
                const rate = influenzaData[d.properties.iso_a3];
                
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke-width", "1.5px")
                    .style("stroke", rate ? "#5a0d87" : "#999");

                tooltipMap.html(`
                    <strong>${countryName}</strong><br>
                    Influenza Rate: ${rate !== undefined ? rate : "No Data"}
                `)
                .style("opacity", 1)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);  // Adjusted for more precise positioning
            })
            .on("mousemove", (event) => {
                tooltipMap.style("left", `${event.pageX -200}px`)
                          .style("top", `${event.pageY - 500}px`);  // Adjusted for more precise positioning
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke-width", "0.5px")
                    .style("stroke", "#333");

                tooltipMap.style("opacity", 0);
            });
    });
}

window.onload = init;
