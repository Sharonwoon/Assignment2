function init() {
    const margin = 50;
    const width = 600;
    const height = 600;

    const svg = d3.select("#bubble")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    const tooltipBubble = d3.select("#bubble-tooltip");

    // Directly declared data (replace with CSV data)
    let data = [
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
        { country: "Belarus", cases: 42 },
        { country: "Belgium", cases: 39 },
        { country: "Belize", cases: 22 },
        { country: "Bhutan", cases: 306 },
        { country: "Bolivia", cases: 2 },
        { country: "Brazil", cases: 939 },
        { country: "Brunei Darussalam", cases: 106 },
        { country: "Bulgaria", cases: 34 },
        { country: "Burkina Faso", cases: 62 },
        { country: "Cambodia", cases: 133 },
        { country: "Cameroon", cases: 122 },
        { country: "Canada", cases: 35026 },
        { country: "Cayman Islands", cases: 82 },
        { country: "Central African Republic", cases: 3 },
        { country: "Chad", cases: 0 },
        { country: "Chile", cases: 1925 },
        { country: "China", cases: 121075 },
        { country: "Hong Kong", cases: 2790 },
        { country: "Colombia", cases: 238 },
        { country: "Costa Rica", cases: 0 },
        { country: "Croatia", cases: 442 },
        { country: "Czechia", cases: 364 },
        { country: "Democratic Republic of the Congo", cases: 56 },
        { country: "Denmark", cases: 6851 },
        { country: "Dominican Republic", cases: 31 },
        { country: "Ecuador", cases: 318 },
        { country: "Egypt", cases: 1387 },
        { country: "El Salvador", cases: 22 },
        { country: "Estonia", cases: 220 },
        { country: "Ethiopia", cases: 404 },
        { country: "Fiji", cases: 56 },
        { country: "Finland", cases: 5 },
        { country: "France", cases: 3710 },
        { country: "French Guiana", cases: 66 },
        { country: "Gabon", cases: 5 },
        { country: "Georgia", cases: 42 },
        { country: "Germany", cases: 239 },
        { country: "Ghana", cases: 86 },
        { country: "Greece", cases: 92 },
        { country: "Guadeloupe", cases: 0 },
        { country: "Guatemala", cases: 22 },
        { country: "Guinea", cases: 56 },
        { country: "Guyana", cases: 26 },
        { country: "Haiti", cases: 106 },
        { country: "Honduras", cases: 130 },
        { country: "Hungary", cases: 54 },
        { country: "Iceland", cases: 246 },
        { country: "India", cases: 484 },
        { country: "Indonesia", cases: 73 },
        { country: "Iran", cases: 10298 },
        { country: "Iraq", cases: 64 },
        { country: "Ireland", cases: 607 },
        { country: "Israel", cases: 35 },
        { country: "Italy", cases: 2841 },
        { country: "Jamaica", cases: 52 },
        { country: "Japan", cases: 3127 },
        { country: "Jordan", cases: 356 },
        { country: "Kazakhstan", cases: 510 },
        { country: "Kenya", cases: 37 },
        { country: "Kosovo", cases: 11 },
        { country: "Kyrgyzstan", cases: 105 },
        { country: "Laos", cases: 301 },
        { country: "Latvia", cases: 55 },
        { country: "Lebanon", cases: 219 },
        { country: "Liberia", cases: 0 },
        { country: "Libya", cases: 124 },
        { country: "Liechtenstein", cases: 9 },
        { country: "Lithuania", cases: 104 },
        { country: "Luxembourg", cases: 75 },
        { country: "Madagascar", cases: 358 },
        { country: "Malaysia", cases: 1021 },
        { country: "Maldives", cases: 70 },
        { country: "Mali", cases: 18 },
        { country: "Malta", cases: 289 },
        { country: "Mauritania", cases: 1 },
        { country: "Mauritius", cases: 59 },
        { country: "Mexico", cases: 3760 },
        { country: "Mongolia", cases: 183 },
        { country: "Montenegro", cases: 26 },
        { country: "Morocco", cases: 51 },
        { country: "Mozambique", cases: 76 },
        { country: "Myanmar", cases: 5 },
        { country: "Namibia", cases: 0 },
        { country: "Nepal", cases: 328 },
        { country: "Netherlands", cases: 1580 },
        { country: "New Zealand", cases: 50 },
        { country: "Nicaragua", cases: 141 },
        { country: "Niger", cases: 31 },
        { country: "Nigeria", cases: 5 },
        { country: "North Macedonia", cases: 25 },
        { country: "Norway", cases: 5849 },
        { country: "Oman", cases: 657 },
        { country: "Pakistan", cases: 582 },
        { country: "United States of America", cases:125513 },
        { country: "United Kingdom", cases:12860 },
        { country: "Spain", cases:9132 },
        { country: "Portugal", cases:9088 }
    ];

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create scale for bubble size
    const sizeScale = d3.scaleSqrt()
                        .domain([0, d3.max(data, d => d.cases)])
                        .range([10, 70]); // Adjusted size scale for all countries

    // Create force simulation
    const simulation = d3.forceSimulation(data)
                         .force("charge", d3.forceManyBody().strength(10))
                         .force("center", d3.forceCenter(width / 2, height / 2))
                         .force("collision", d3.forceCollide().radius(d => sizeScale(d.cases) + 5));

    // Create circles for the bubble chart
    const bubbles = svg.selectAll("circle")
                       .data(data)
                       .enter()
                       .append("circle")
                       .attr("r", d => sizeScale(d.cases))
                       .style("fill", (d, i) => color(i))
                       .style("opacity", 0.7)
                       .style("stroke", "#fff")
                       .style("stroke-width", "2px")
                       .on("mouseover", function(event, d) {
                            d3.select(this)
                              .transition()
                              .duration(200)
                              .style("opacity", 1);

                            tooltipBubble.html(`${d.country}: ${d.cases} cases`)
                                         .style("opacity", 1)
                                         .style("left", `${event.pageX + 10}px`)
                                         .style("top", `${event.pageY - 30}px`);
                       })
                       .on("mouseout", function() {
                            d3.select(this)
                              .transition()
                              .duration(200)
                              .style("opacity", 0.7);

                            tooltipBubble.style("opacity", 0);
                       })
                       // Add click event to highlight corresponding country on the map
                       .on("click", function(event, d) {
                            // Highlight country in the map
                            highlightCountry(d.country);
                       });

    // Add country name and case number
    // Add country name and case number inside each bubble
    bubbles.append("text")
           .attr("class", "bubble-text")
           .attr("text-anchor", "middle")
           .attr("dy", ".3em") // Vertically center the text
           .style("font-size", "10px")
           .style("fill", "#fff")
           .text(d => `${d.country}: ${d.cases}`);

    // Update the positions of the bubbles according to the force simulation
    simulation.on("tick", function() {
        bubbles.attr("cx", function(d) { return d.x; })
               .attr("cy", function(d) { return d.y; });
    });

    // Add map setup ------------------------------------------------------------------------------------------------------------------------------
    const mapWidth = 800;
    const mapHeight = 600;
    const projection = d3.geoMercator().translate([mapWidth / 2, mapHeight / 2]).scale(130);
    const path = d3.geoPath().projection(projection);
    const colorMap = d3.scaleQuantize().range(d3.schemeBlues[8]);

    const svgMap = d3.select("#Map")
                     .append("svg")
                     .attr("width", mapWidth)
                     .attr("height", mapHeight)
                     .call(d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => svgMap.attr("transform", event.transform)))
                     .append("g");

    const tooltipMap = d3.select("#map-tooltip");

    // Load GeoJSON data
    d3.json("GeoJsonWorldMap.json").then(json => {
        const influenzaData = {};
        data.forEach(d => { 
            influenzaData[d.country] = d.cases; // Match by country name
        });
        colorMap.domain(d3.extent(data, d => d.cases));

        // Add the countries to the map and style them
        svgMap.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", d => {
                const rate = influenzaData[d.properties.name]; // Match by country name
                return rate ? colorMap(rate) : "#e0e0e0"; // Color based on rate
            })
            .style("stroke", "#333")
            .style("stroke-width", "0.5px")
            .on("mouseover", function(event, d) {
                const countryName = d.properties.name;
                const rate = influenzaData[d.properties.name];
                
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
                .style("top", `${event.pageY - 30 }px`);
            })
            .on("mousemove", (event) => {
                tooltipMap.style("left", `${event.pageX - 200}px`)
                          .style("top", `${event.pageY - 100}px`); // Adjusted for better placement
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke-width", "0.5px")
                    .style("stroke", "#333");

                tooltipMap.style("opacity", 0);
            });
    });

    // Highlight the country on the map when a bubble is clicked
    function highlightCountry(countryName) {
        svgMap.selectAll("path")
            .style("opacity", function(d) {
                // Check if the country matches the clicked bubble
                if (d.properties.name === countryName) {
                    // Highlight the matched country
                    return 1;
                }
                // Make other countries more transparent
                return 0.2;
            })
            .style("stroke", function(d) {
                // Check if the country matches the clicked bubble
                if (d.properties.name === countryName) {
                    return "#ff0000"; // Highlight with a different color
                }
                return "#333";
            });
    }
}

window.onload = init;
