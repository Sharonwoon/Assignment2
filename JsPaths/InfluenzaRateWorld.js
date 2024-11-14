function init() {
    const width = 500;
    const height = 600;
    const margin = 50;
    let expanded = false;

    // Create SVG container with a border for the bubbles
    const svg = d3.select("#bubble")
        .append("svg")
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2)
        .style("border", "2px solid #ddd")
        .append("g")
        .attr("transform", `translate(${margin}, ${margin})`);

    // Tooltip for displaying details
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "bubble-tooltip")
        .style("position", "absolute")
        .style("background", "#333")
        .style("color", "#fff")
        .style("padding", "5px 10px")
        .style("border-radius", "4px")
        .style("opacity", 0)
        .style("pointer-events", "none");

    
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

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Scale for bubble size
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.cases)])
        .range([10, 60]);

    // Force simulation
    const simulation = d3.forceSimulation(data)
        .force("charge", d3.forceManyBody().strength(10))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => sizeScale(d.cases) + 5));

    // Create circles for each bubble
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
            d3.select(this).transition().duration(200).style("opacity", 1);
            tooltip.style("opacity", 1)
                .html(`<strong>${d.country}</strong><br>Cases: ${d.cases}`);
            highlightCountry(d.country);
            showMapStatistics(d.country, d.cases);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", function() {
            d3.select(this).transition().duration(200).style("opacity", 0.7);
            tooltip.style("opacity", 0);
            resetMapHighlight();
            hideMapStatistics();
        });

    // Update bubble positions based on force simulation
    simulation.on("tick", function() {
        bubbles.attr("cx", d => d.x)
               .attr("cy", d => d.y);
    });

    // Button functionalities

    // Spin the bubbles
    d3.select("#spinButton").on("click", function() {
        svg.transition()
           .duration(1000)
           .attr("transform", `translate(${margin}, ${margin}) rotate(${Math.random() * 360}, ${width / 2}, ${height / 2})`);
    });

    // Randomize colors
    d3.select("#colorChaosButton").on("click", function() {
        bubbles.transition()
               .duration(500)
               .style("fill", () => color(Math.floor(Math.random() * 10)));
    });

    // Expand and shrink bubbles
    d3.select("#expandButton").on("click", function() {
        expanded = !expanded;
        bubbles.transition()
               .duration(500)
               .attr("r", d => expanded ? sizeScale(d.cases) * 1.5 : sizeScale(d.cases));
    });

    // Reset all effects
    d3.select("#resetButton").on("click", function() {
        svg.transition()
           .duration(500)
           .attr("transform", `translate(${margin}, ${margin}) rotate(0)`);
        bubbles.transition()
               .duration(500)
               .attr("r", d => sizeScale(d.cases))
               .style("fill", (d, i) => color(i));
        expanded = false;
        resetMapHighlight();
        hideMapStatistics();
    });

    // Map setup
    const mapWidth = 800;
    const mapHeight = 600;
    const projection = d3.geoMercator().translate([mapWidth / 2, mapHeight / 2]).scale(130);
    const path = d3.geoPath().projection(projection);
    const colorMap = d3.scaleQuantize().range(d3.schemeBlues[8]);

    const svgMap = d3.select("#Map")
                     .append("svg")
                     .attr("width", mapWidth)
                     .attr("height", mapHeight)
                     .call(d3.zoom().scaleExtent([1, 8]).on("zoom", function(event) {
                         svgMap.attr("transform", event.transform);
                     }))
                     .append("g");

    const tooltipMap = d3.select("body").append("div")
                         .attr("class", "map-tooltip")
                         .style("position", "absolute")
                         .style("background", "#333")
                         .style("color", "#fff")
                         .style("padding", "5px 10px")
                         .style("border-radius", "4px")
                         .style("opacity", 0)
                         .style("pointer-events", "none");

    d3.json("Design/GeoJsonWorldMap.json").then(json => {
        const influenzaData = {};
        data.forEach(d => { 
            influenzaData[d.country] = d.cases;
        });
        colorMap.domain(d3.extent(data, d => d.cases));

        svgMap.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", d => {
                const rate = influenzaData[d.properties.name];
                return rate ? colorMap(rate) : "#e0e0e0";
            })
            .style("stroke", "#333")
            .style("stroke-width", "0.5px");
    });

    const mapText = svgMap.append("text")
        .attr("id", "mapText")
        .attr("x", mapWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .style("fill", "#333")
        .style("opacity", 0);

    function showMapStatistics(countryName, cases) {
        mapText.text(`${countryName}: ${cases} cases`)
               .transition()
               .duration(200)
               .style("opacity", 1);
    }

    function hideMapStatistics() {
        mapText.transition()
               .duration(200)
               .style("opacity", 0);
    }

    function highlightCountry(countryName) {
        svgMap.selectAll("path")
            .style("opacity", d => d.properties.name === countryName ? 1 : 0.2)
            .style("stroke", d => d.properties.name === countryName ? "#ff0000" : "#333");
    }

    function resetMapHighlight() {
        svgMap.selectAll("path")
            .style("opacity", 1)
            .style("stroke", "#333");
    }

    // Zoom in and Zoom out buttons
    const zoom = d3.zoom()
                   .scaleExtent([1, 8])
                   .on("zoom", (event) => svgMap.attr("transform", event.transform));

    d3.select("#zoomInButton").on("click", function() {
        svgMap.transition().call(zoom.scaleBy, 1.2);
    });

    d3.select("#zoomOutButton").on("click", function() {
        svgMap.transition().call(zoom.scaleBy, 0.8);
    });
}

// Initialize the visualization
window.onload = init;





