const w = 800;
const h = 400;
const padding = 50;

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

// Function to determine the symbol based on age group
function getSymbol(ageGroup) {
    if (ageGroup === "<5 years") return symbolCircle();
    else if (ageGroup === "5-64 years") return symbolTriangle();
    else return symbolDiamond();
}

// Function to parse year ranges and extract the start year
function parseYearRange(yearRange) {
    const [startYear] = yearRange.split("–").map(d => parseInt(d.trim()));
    return startYear;
}

// Function to parse rate ranges and calculate the average
function parseRateRange(rateRange) {
    const [min, max] = rateRange.split("–").map(d => parseFloat(d.trim()));
    return (min + max) / 2;
}

// Load data from CSV file
d3.csv("InfluenzaHospitalization.csv").then(data => {
    console.log("Data loaded:", data);  // Debugging log for loaded data

    // Convert data fields to appropriate types and flatten structure
    const flattenedData = [];
    data.forEach(d => {
        const year = parseYearRange(d["Years"]);
        
        if (d["Aged <5 years"]) {
            const rateUnder5 = parseRateRange(d["Aged <5 years"]);
            flattenedData.push({ year, rate: rateUnder5, ageGroup: "<5 years" });
        }
        if (d["Aged 5- 64 years"]) {
            const rate5To64 = parseRateRange(d["Aged 5- 64 years"]);
            flattenedData.push({ year, rate: rate5To64, ageGroup: "5-64 years" });
        }
        if (d["Aged 65 years"]) {
            const rate65Plus = parseRateRange(d["Aged 65 years"]);
            flattenedData.push({ year, rate: rate65Plus, ageGroup: "≥65 years" });
        }
    });

    console.log("Flattened Data:", flattenedData);  // Debugging log

    // Scales based on data
    const xScale = d3.scaleLinear()
        .domain(d3.extent(flattenedData, d => d.year))
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(flattenedData, d => d.rate) + 50])
        .range([h - padding, padding]);

    // Plot symbols on the SVG
    svg.selectAll("path")
        .data(flattenedData)
        .enter()
        .append("path")
        .attr("d", d => getSymbol(d.ageGroup))
        .attr("transform", d => `translate(${xScale(d.year)}, ${yScale(d.rate)})`)
        .attr("fill", d => {
            if (d.ageGroup === "<5 years") return "black";
            else if (d.ageGroup === "5-64 years") return "gray";
            else return "darkgray";
        });

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
        .append("text")
        .attr("x", w / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .text("Year");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("x", -padding)
        .attr("y", padding / 2)
        .attr("fill", "black")
        .text("Rate per 100,000");

    // Legend
    const legendData = [
        { ageGroup: "<5 years", symbol: symbolCircle(), color: "black" },
        { ageGroup: "5-64 years", symbol: symbolTriangle(), color: "gray" },
        { ageGroup: "≥65 years", symbol: symbolDiamond(), color: "darkgray" }
    ];

    const legend = svg.selectAll(".legend")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${w - padding * 3}, ${padding + i * 20})`);

    legend.append("path")
        .attr("d", d => d.symbol)
        .attr("fill", d => d.color);

    legend.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .text(d => d.ageGroup);
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
