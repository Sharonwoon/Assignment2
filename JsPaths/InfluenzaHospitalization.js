const w = 800;
const h = 400;
const padding = 70; // Increased padding for better centering

// SVG canvas
const svg = d3.select("article.content")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("border", "1px solid black");  // Debugging border

const maxCountriesDisplayed = 5;
let currentCountries = [];  // Track currently displayed countries

// Define symbols for different age groups
const symbolCircle = d3.symbol().type(d3.symbolCircle).size(100);
const symbolTriangle = d3.symbol().type(d3.symbolTriangle).size(100);
const symbolDiamond = d3.symbol().type(d3.symbolDiamond).size(100);

function getSymbol(ageGroup) {
    if (ageGroup === "<5 years") return symbolCircle();
    else if (ageGroup === "5-64 years") return symbolTriangle();
    else return symbolDiamond();
}

function parseYearRange(yearRange) {
    const [startYear] = yearRange.split("–").map(d => parseInt(d.trim()));
    return startYear;
}

function parseRateRange(rateRange) {
    const [min, max] = rateRange.split("–").map(d => parseFloat(d.trim()));
    return (min + max) / 2;
}

// Load data from CSV file
d3.csv("InfluenzaHospitalization.csv").then(data => {
    const countries = [...new Set(data.map(d => d.Country))];  // Get unique countries

    function updateDisplay() {
        // Filter data based on currentCountries array
        const filteredData = data.filter(d => currentCountries.includes(d.Country))
            .flatMap(d => {
                const year = parseYearRange(d["Years"]);
                const ageGroups = [
                    { ageGroup: "<5 years", rate: d["Aged <5 years"] },
                    { ageGroup: "5-64 years", rate: d["Aged 5- 64 years"] },
                    { ageGroup: "≥65 years", rate: d["Aged 65 years"] }
                ];
                return ageGroups.map(ag => ({
                    country: d.Country,
                    year,
                    rate: parseRateRange(ag.rate),
                    ageGroup: ag.ageGroup
                }));
            });

        // Update scales with filtered data
        const xScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.year))
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.rate) + 50])
            .range([h - padding, padding]);

        // Clear previous plot
        svg.selectAll("*").remove();

        // Plot symbols on the SVG
        svg.selectAll("path")
            .data(filteredData)
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
            .attr("y", 50)  // Adjusted y to position label below axis
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .text("Year");

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
    }

    // Add button event listeners
    d3.select("#add-country").on("click", () => {
        const remainingCountries = countries.filter(c => !currentCountries.includes(c));
        if (currentCountries.length < maxCountriesDisplayed && remainingCountries.length > 0) {
            currentCountries.push(remainingCountries[0]);  // Add the next country
            updateDisplay();
        }
    });

    d3.select("#remove-country").on("click", () => {
        if (currentCountries.length > 0) {
            currentCountries.pop();  // Remove the last country
            updateDisplay();
        }
    });

    // Initialize with the first five countries
    currentCountries = countries.slice(0, maxCountriesDisplayed);
    updateDisplay();
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
