// Chart dimensions
const width = 1300;
const height = 850;
const innerRadius = 100;
const outerRadius = Math.min(width, height) / 2 - 50;

// Load CSV data
d3.csv('CSV_files/HospitalizationAge.csv').then(data => {
    // Parse and convert numeric fields
    data.forEach(d => {
        d["All ages"] = +d["All ages"];
        d["Children age 0-4"] = +d["Children age 0-4"];
        d["Elderly aged 65+"] = +d["Elderly aged 65+"];
    });

    const ageGroups = ["Children age 0-4", "All ages", "Elderly aged 65+"];
    const colorScale = d3.scaleOrdinal()
        .domain(ageGroups)
        .range(["#414C6B", "#5BAEB7" , "#1E80C1"]); // Bluish theme colors

    const svg = d3.select("#circular-bar-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#333")
        .style("color", "#fff")
        .style("padding", "5px 10px")
        .style("border-radius", "4px")
        .style("font-size", "12px");

    // Angle and radius scales
    const angleScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([0, 2 * Math.PI])
        .align(0);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d["All ages"], d["Children age 0-4"], d["Elderly aged 65+"]))])
        .range([innerRadius, outerRadius]);

    // Draw radial bars with bounce animation
    ageGroups.forEach((ageGroup, i) => {
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", colorScale(ageGroup))
            .attr("d", d3.arc()
                .innerRadius(innerRadius + i * 30)
                .outerRadius(d => radiusScale(d[ageGroup]))
                .startAngle(d => angleScale(d.Country))
                .endAngle(d => angleScale(d.Country) + angleScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))
            .attr("opacity", 0)
            .transition()
            .delay((d, j) => j * 50)
            .duration(800)
            .ease(d3.easeBounceOut)
            .attr("opacity", 1);

        // Hover effect for each path
        svg.selectAll("path")
            .on("mouseover", function (event, d) {
                d3.select(this).attr("opacity", 0.8); // Optional: Highlight the bar on hover
                tooltip.html(`${ageGroup}<br>Country: ${d.Country}<br>Value: ${d[ageGroup]}`)
                    .style("visibility", "visible");
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 1); // Reset the opacity
                tooltip.style("visibility", "hidden");
            });
    });

    // Radial lines and labels
    const labelOffset = outerRadius + 35;

    svg.append("g")
        .selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => {
            const midAngle = angleScale(d.Country) + angleScale.bandwidth() / 2;
            return Math.cos(midAngle - Math.PI / 2) * (outerRadius + 10);
        })
        .attr("y1", d => {
            const midAngle = angleScale(d.Country) + angleScale.bandwidth() / 2;
            return Math.sin(midAngle - Math.PI / 2) * (outerRadius + 10);
        })
        .attr("x2", d => {
            const midAngle = angleScale(d.Country) + angleScale.bandwidth() / 2;
            return Math.cos(midAngle - Math.PI / 2) * labelOffset;
        })
        .attr("y2", d => {
            const midAngle = angleScale(d.Country) + angleScale.bandwidth() / 2;
            return Math.sin(midAngle - Math.PI / 2) * labelOffset;
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 0.8);


    // Add country labels
    svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", d => {
            const midAngle = angleScale(d.Country) + angleScale.bandwidth() / 2;
            return Math.cos(midAngle - Math.PI / 2) * (labelOffset + 5);
        })
        .attr("y", d => {
            const midAngle = angleScale(d.Country) + angleScale.bandwidth() / 2;
            return Math.sin(midAngle - Math.PI / 2) * (labelOffset + 5);
        })
        .text(d => d.Country)
        .style("font-size", "14px") // Increased font size for better readability
        .style("fill", "#333")
        .style("font-weight", "bold") // Make text bold for emphasis
        .style("font-family", "Arial, sans-serif") // Choose a clean, modern font
        .style("letter-spacing", "0.5px") // Slight spacing for better appearance
        .style("text-shadow", "0px 0px 3px rgba(0, 0, 0, 0.3)") // Subtle shadow to enhance readability
        .style("text-transform", "capitalize"); // Capitalize the first letter of each word for consistency
      

    // Center labels for age groups
    const centerLabels = svg.append("g").attr("class", "center-labels");
    ageGroups.forEach((ageGroup, i) => {
        centerLabels.append("rect")
            .attr("x", -50)
            .attr("y", (i - 1) * 20 - 6)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(ageGroup));

        centerLabels.append("text")
            .attr("x", -35)
            .attr("y", (i - 1) * 20)
            .text(ageGroup)
            .style("fill", colorScale(ageGroup))
            .style("font-size", "14px")
            .attr("alignment-baseline", "middle");
    });
    function sortData(order) {
    // Sort data based on the selected order
    data.sort((a, b) => {
        if (order === 'asc') {
            return d3.ascending(a["All ages"], b["All ages"]);
        } else if (order === 'desc') {
            return d3.descending(a["All ages"], b["All ages"]);
        }
    });
    
    // Clear previous chart
    svg.selectAll("*").remove();

    // Redraw the chart with sorted data
    drawChart();
}

// Function to draw the chart (place all chart-drawing code inside this function)
function drawChart() {
    // Your existing chart code goes here, from setting up scales to drawing bars
    // Replace `d3.csv` part with this function so the chart updates on sorting
    ageGroups.forEach((ageGroup, i) => {
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", colorScale(ageGroup))
            .attr("d", d3.arc()
                .innerRadius(innerRadius + i * 30)
                .outerRadius(d => radiusScale(d[ageGroup]))
                .startAngle(d => angleScale(d.Country))
                .endAngle(d => angleScale(d.Country) + angleScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))
            .attr("opacity", 0)
            .transition()
            .delay((d, j) => j * 50)
            .duration(800)
            .ease(d3.easeBounceOut)
            .attr("opacity", 1);

        // Hover effect for each path
        svg.selectAll("path")
            .on("mouseover", function (event, d) {
                d3.select(this).attr("opacity", 0.8);
                tooltip.html(`${ageGroup}<br>Country: ${d.Country}<br>Value: ${d[ageGroup]}`)
                    .style("visibility", "visible");
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 1);
                tooltip.style("visibility", "hidden");
            });
    });

    // Radial lines and labels, center labels, and other chart elements go here
}

// Initial chart drawing
drawChart();
});
