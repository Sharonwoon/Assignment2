// Chart dimensions
const width = 1300;
const height = 700;
const innerRadius = 100;
const outerRadius = Math.min(width, height) / 2 - 50;

// Load CSV data
d3.csv('HospitalizationAge.csv').then(data => {
    // Parse and convert numeric fields
    data.forEach(d => {
        d["All ages"] = +d["All ages"];
        d["Children age 0-4"] = +d["Children age 0-4"];
        d["Elderly aged 65+"] = +d["Elderly aged 65+"];
    });

    const ageGroups = ["Children age 0-4", "All ages", "Elderly aged 65+"];
    const colorScale = d3.scaleOrdinal()
        .domain(ageGroups)
        .range(["#ff7f0e", "#1f77b4", "#2ca02c"]);

    const svg = d3.select("#circular-bar-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Angle and radius scales
    const angleScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([0, 2 * Math.PI])
        .align(0);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d["All ages"], d["Children age 0-4"], d["Elderly aged 65+"]))])
        .range([innerRadius, outerRadius]);

    // Draw radial bars
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
                .padRadius(innerRadius));
    });

    // Improved radial line and label positioning
    const labelOffset = outerRadius + 20;  // Decrease offset for closer alignment

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

    // Add improved country labels
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
        .style("font-size", "9px")
        .style("fill", "#333");

    // Central labels for age groups
    const centerLabels = svg.append("g").attr("class", "center-labels");
    ageGroups.forEach((ageGroup, i) => {
        centerLabels.append("rect")
            .attr("x", -30)
            .attr("y", (i - 1) * 20 - 6)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(ageGroup));

        centerLabels.append("text")
            .attr("x", -15)
            .attr("y", (i - 1) * 20)
            .text(ageGroup)
            .style("fill", colorScale(ageGroup))
            .style("font-size", "14px")
            .attr("alignment-baseline", "middle");
    });
});
