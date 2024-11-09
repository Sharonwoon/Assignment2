function init() {
    // Pie Chart Setup
    const margin = 20;
    const w = 300;
    const h = 300;
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

    // Directly declared data
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
        { country: "Panama", cases: 36 },
        { country: "Papua New Guinea", cases: 16 },
        { country: "Paraguay", cases: 8 },
        { country: "Peru", cases: 0 },
        { country: "Philippines", cases: 224 },
        { country: "Poland", cases: 213 },
        { country: "Portugal", cases: 9088 },
        { country: "Qatar", cases: 1220 },
        { country: "Moldova", cases: 59 },
        { country: "Romania", cases: 312 },
        { country: "Russian Federation", cases: 9310 },
        { country: "Rwanda", cases: 6 },
        { country: "Saint Lucia", cases: 28 },
        { country: "Saint Vincent and the Grenadines", cases: 27 },
        { country: "Saudi Arabia", cases: 2322 },
        { country: "Senegal", cases: 72 },
        { country: "Serbia", cases: 41 },
        { country: "Seychelles", cases: 0 },
        { country: "Sierra Leone", cases: 0 },
        { country: "Singapore", cases: 413 },
        { country: "Slovakia", cases: 122 },
        { country: "Slovenia", cases: 434 },
        { country: "Somalia", cases: 28 },
        { country: "South Africa", cases: 38 },
        { country: "South Sudan", cases: 15 },
        { country: "Spain", cases: 9132 },
        { country: "Sri Lanka", cases: 99 },
        { country: "Suriname", cases: 1 },
        { country: "Sweden", cases: 6036 },
        { country: "Switzerland", cases: 3465 },
        { country: "Syria", cases: 76 },
        { country: "Tajikistan", cases: 166 },
        { country: "Thailand", cases: 603 },
        { country: "Timor-Leste", cases: 19 },
        { country: "Togo", cases: 79 },
        { country: "Tunisia", cases: 18 },
        { country: "Uganda", cases: 47 },
        { country: "Ukraine", cases: 252 },
        { country: "United Arab Emirates", cases: 3170 },
        { country: "England", cases: 12860 },
        { country: "Ireland", cases: 674 },
        { country: "Scotland", cases: 3596 },
        { country: "Wales", cases: 662 },
        { country: "Tanzania", cases: 145 },
        { country: "United States of America", cases: 125513 },
        { country: "Uruguay", cases: 1 },
        { country: "Uzbekistan", cases: 86 },
        { country: "Venezuela", cases: 77 },
        { country: "Vietnam", cases: 272 },
        { country: "Yemen", cases: 4 },
        { country: "Zambia", cases: 22 },
        { country: "Zimbabwe", cases: 137 }
    ];

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
                    tooltipPie.style("left", `${event.pageX - 200}px`)
                              .style("top", `${event.pageY - 500}px`);  // Adjusted for more precise positioning
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

    // Call the function to update the chart with the initial data
    updateChart();

    // Map Setup
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
                .style("top", `${event.pageY - 30}px`);
            })
            .on("mousemove", (event) => {
                tooltipMap.style("left", `${event.pageX - 200}px`)
                          .style("top", `${event.pageY - 500}px`);
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