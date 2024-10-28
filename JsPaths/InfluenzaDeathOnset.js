var allData, displayedData, ageGroups, years, stackedData, series;
var w = 800;
var h = 400;
var margin = { top: 50, right: 120, bottom: 70, left: 70 };
var maxCount = 30;
var maxAgeGroups = 10; // Set maximum number of age groups to display initially

// Initialize scales and color
var xscale = d3.scaleBand().range([margin.left, w - margin.right]).padding(0.1);
var yscale = d3.scaleLinear().range([h - margin.bottom, margin.top]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Create SVG container
var svg = d3.select("#stacked")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

function drawChart() {
    // Clear previous chart elements
    svg.selectAll("*").remove();

    // Define the stack layout
    series = d3.stack().keys(years)(stackedData);

    xscale.domain(ageGroups);
    yscale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);

    // Create groups for each year's bars
    var groups = svg.selectAll("g.series")
                    .data(series)
                    .enter()
                    .append("g")
                    .attr("class", "series")
                    .style("fill", (d, i) => color(years[i]));

    groups.selectAll("rect")
          .data(d => d)
          .enter()
          .append("rect")
          .attr("x", d => xscale(d.data.age))
          .attr("y", d => yscale(d[1]))
          .attr("height", d => yscale(d[0]) - yscale(d[1]))
          .attr("width", xscale.bandwidth());

    // Add x-axis and rotate labels
    svg.append("g")
       .attr("transform", `translate(0, ${h - margin.bottom})`)
       .call(d3.axisBottom(xscale))
       .selectAll("text")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yscale).ticks(10));

    // Add x-axis label
    svg.append("text")
       .attr("class", "x-label")
       .attr("x", w / 2) // Center horizontally
       .attr("y", h - 10) // Position below the chart
       .attr("text-anchor", "middle")
       .attr("fill", "black")
       .text("Day onset to death"); //age count for X- axis

    // Add y-axis label
    svg.append("text")
       .attr("class", "y-label")
       .attr("x", -h / 2) // Rotate for vertical alignment
       .attr("y", 15) // Position on the left
       .attr("transform", "rotate(-90)") // Rotate the text
       .attr("text-anchor", "middle")
       .attr("fill", "black")
       .text("Onset Death Count"); //age count for Y- axis

    // Add legend for years
    svg.selectAll("mydots")
       .data(years)
       .enter()
       .append("circle")
       .attr("cx", w - 80)
       .attr("cy", (d, i) => 15 + i * 25)
       .attr("r", 7)
       .style("fill", d => color(d));

    svg.selectAll("mylabels")
       .data(years)
       .enter()
       .append("text")
       .attr("x", w - 70)
       .attr("y", (d, i) => 15 + i * 25)
       .style("fill", d => color(d))
       .text(d => d)
       .attr("text-anchor", "left")
       .style("alignment-baseline", "middle");
}

// Load all data from CSV initially
d3.csv("InfluenzaDeathOnset.csv").then(function(data) {
    // Convert COUNT to numeric and cap at maxCount
    data.forEach(d => d.COUNT = Math.min(+d.COUNT, maxCount));

    // Filter out age groups outside 1 to 30 (including "30+")
    data = data.filter(d => (parseInt(d.AGE_GROUP) >= 1 && parseInt(d.AGE_GROUP) <= 30) || d.AGE_GROUP === "30+");

    // Group data by AGE_GROUP, then by YEAR within each AGE_GROUP
    var nestedData = d3.group(data, d => d.AGE_GROUP, d => d.YEAR);

    // Store all data and initialize displayed data with the first few groups
    allData = Array.from(nestedData, ([age, years]) => {
        var counts = {};
        years.forEach((yearData, year) => {
            counts[year] = Math.min(yearData[0].COUNT, maxCount);
        });
        return { age, ...counts };
    });

    years = Array.from(new Set(data.map(d => d.YEAR)));

    // Sort age groups numerically, placing "30+" at the end
    allData.sort((a, b) => {
        if (a.age === "30+") return 1;
        if (b.age === "30+") return -1;
        return +a.age - +b.age;
    });

    // Display only the first `maxAgeGroups` age groups initially
    displayedData = allData.slice(0, maxAgeGroups);
    ageGroups = displayedData.map(d => d.age);
    stackedData = displayedData;

    drawChart();
});

// Add button functionality
d3.select("#Adding").on("click", function() {
    if (displayedData.length < allData.length) {
        // Add the next age group from the CSV data
        displayedData.push(allData[displayedData.length]);
        ageGroups = displayedData.map(d => d.age);
        stackedData = displayedData;
        
        drawChart();
    } else {
        alert("All age groups are already displayed!");
    }
});

// Remove button functionality
d3.select("#Removing").on("click", function() {
    if (displayedData.length > 1) {
        // Remove the last displayed age group
        displayedData.pop();
        ageGroups = displayedData.map(d => d.age);
        stackedData = displayedData;
        
        drawChart();
    }
});
