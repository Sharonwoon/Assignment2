const w = 1300;
const h = 600;
const padding = 70; // Increased padding for better centering

// SVG canvas
const svg = d3.select("article.content")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("border", "1px solid black");  // Debugging border

// Define symbols for different age groups
const symbolCircle = d3.symbol().type(d3.symbolCircle).size(100);
const symbolTriangle = d3.symbol().type(d3.symbolTriangle).size(100);
const symbolDiamond = d3.symbol().type(d3.symbolDiamond).size(100);

function getSymbol(ageGroup) {
    if (ageGroup === "Children age 0-4") return symbolCircle();
    else if (ageGroup === "Elderly aged 65+") return symbolDiamond();
    else return symbolTriangle();
}

// Define colors for each age group
function getColor(ageGroup) {
    if (ageGroup === "Children age 0-4") return "#FF6347"; // Tomato Red
    else if (ageGroup === "Elderly aged 65+") return "#8B4513"; // Saddle Brown
    else return "#4682B4"; // Steel Blue
}

// Create a tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "hospitalization-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("font-size", "14px")
    .style("pointer-events", "none");  // Prevent it from interfering with mouse events

// Load data from CSV file
d3.csv("HospitalizationAge.csv").then(data => {
    // Filter out rows with "-" and parse the data into a more usable format
    const filteredData = data.flatMap(d => {
        const ageGroups = [
            { ageGroup: "All ages", rate: d["All ages"] },
            { ageGroup: "Children age 0-4", rate: d["Children age 0-4"] },
            { ageGroup: "Elderly aged 65+", rate: d["Elderly aged 65+"] }
        ];
        return ageGroups
            .filter(ag => ag.rate !== "-")  // Skip rows where rate is "-"
            .map(ag => ({
                country: d.Country,
                rate: parseFloat(ag.rate),  // Convert to float for proper plotting
                ageGroup: ag.ageGroup
            }));
    });

    // Update scales with filtered data
    const xScale = d3.scaleBand()
        .domain(filteredData.map(d => d.country))
        .range([padding, w - padding])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.rate) + 20])  // Add padding for the highest value
        .range([h - padding, padding]);

    // Clear previous plot
    svg.selectAll("*").remove();

    // Plot symbols for each country with added color
    svg.selectAll("path.symbol")
        .data(filteredData)
        .enter()
        .append("path")
        .attr("d", d => getSymbol(d.ageGroup))
        .attr("transform", d => `translate(${xScale(d.country) + xScale.bandwidth() / 2}, ${yScale(d.rate)})`)
        .attr("fill", d => getColor(d.ageGroup)) // Apply color based on age group
        .on("mouseover", function(event, d) {
            // Change fill color on hover
            d3.select(this).attr("fill", "yellow"); // Change to yellow on hover
            tooltip.style("visibility", "visible")
                .html(`Country: ${d.country}<br>Age Group: ${d.ageGroup}<br>Rate: ${d.rate}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            // Restore original color
            d3.select(this).attr("fill", getColor(d.ageGroup));  // Restore original color
            tooltip.style("visibility", "hidden");
        });

    // Add axes
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("x", -padding)
        .attr("y", padding / 2)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Rate per 100,000");

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${w - 132}, 50)`);

    legend.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).attr("fill", "#FF6347"); // Red
    legend.append("text").attr("x", 10).attr("y", 0).text("Children age 0-4");

    legend.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 5).attr("fill", "#4682B4"); // Blue
    legend.append("text").attr("x", 10).attr("y", 20).text("All ages");

    legend.append("circle").attr("cx", 0).attr("cy", 40).attr("r", 5).attr("fill", "#8B4513"); // Brown
    legend.append("text").attr("x", 10).attr("y", 40).text("Elderly aged 65+");
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
