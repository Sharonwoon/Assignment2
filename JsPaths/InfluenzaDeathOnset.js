var allData, displayedData, ageGroups, years, stackedData, series;
var w = 1300; // Increased width for more horizontal space
var h = 900;  // Increased height for more vertical space
var margin = { top: 50, right: 120, bottom: 70, left: 100 }; // Adjusted margins
var maxCount = 50; // Increase maximum count if needed

// Define colors using a different palette
var color = d3.scaleOrdinal(d3.schemePaired); // A different color scheme for better visual distinction

// Initialize scales
var xscale = d3.scaleLinear().range([0, w - margin.left - margin.right]);
var yscale = d3.scaleBand().range([h - margin.bottom, margin.top]).padding(0.4);

// Create SVG container
var svg = d3.select("#stacked")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Create tooltip
var tooltip = d3.select("body").append("div")
                .attr("class", "stacked_tooltip")
                .style("opacity", 0);

function drawChart() {
    // Clear previous chart elements
    svg.selectAll("*").remove();

    // Define the stack layout
    series = d3.stack().keys(years)(stackedData);

    // Set domain for x-scale
    xscale.domain([0, d3.max(series, d => d3.max(d, d => d[1])) + 10]);
    yscale.domain(ageGroups);

    // Create groups for each year's bars
    var groups = svg.selectAll("g.series")
                    .data(series)
                    .enter()
                    .append("g")
                    .attr("class", "series")
                    .style("fill", (d, i) => color(years[i]));

    var rects = groups.selectAll("rect")
                      .data(d => d);

    // Add entering bars with animation from left
    rects.enter()
         .append("rect")
         .attr("x", d => xscale(0)) // Start from 0 for animation effect
         .attr("y", d => yscale(d.data.age))
         .attr("width", 0) // Start width at 0 for animation effect
         .attr("height", yscale.bandwidth() * 0.8)
         .on("mouseover", function(event, d) {
             d3.select(this).transition().duration(200).attr("transform", "scale(1.05)"); // Scaling effect
             tooltip.transition().duration(200).style("opacity", 0.9);
             tooltip.html(`Year: ${d.data.year} <br>Count: ${d[1] - d[0]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
         })
         .on("mouseout", function() {
             d3.select(this).transition().duration(200).attr("transform", "scale(1)"); // Reset scale
             tooltip.transition().duration(500).style("opacity", 0);
         })
         .transition() // Transition for enter animation
         .duration(1000)
         .attr("x", d => xscale(d[0] + 4.7))
         .attr("width", d => xscale(d[1]) - xscale(d[0]));

    // Update bars with smooth transition on filtering
    rects.transition()
         .duration(1000)
         .attr("x", d => xscale(d[0] + 4.7))
         .attr("y", d => yscale(d.data.age))
         .attr("width", d => xscale(d[1]) - xscale(d[0]))
         .attr("height", yscale.bandwidth() * 0.8);

    // Add y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yscale).tickFormat(d => d));

    // Add x-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, ${h - margin.bottom})`) // Move x-axis to the bottom
       .call(d3.axisBottom(xscale).ticks(10));

    // Add x-axis label
    svg.append("text")
       .attr("class", "x-label")
       .attr("x", (w - margin.left - margin.right) / 2 + margin.left)
       .attr("y", h - margin.bottom + 30) // Position below the x-axis
       .attr("text-anchor", "middle")
       .attr("fill", "black")
       .text("Onset Death Count");

    // Add y-axis label
    svg.append("text")
       .attr("class", "y-label")
       .attr("x", margin.left / 2) // Position on the left
       .attr("y", margin.bottom - 70) // Adjust this to align correctly
       .attr("transform", "rotate(-90)") // Rotate the text
       .attr("text-anchor", "middle")
       .attr("fill", "black")
       .text("Age Groups");

    // Add legend for years
    svg.selectAll("mydots")
       .data(years)
       .enter()
       .append("circle")
       .attr("cx", w - 80)
       .attr("cy", (d, i) => 90 + i * 30)
       .attr("r", 7)
       .style("fill", d => color(d));

    svg.selectAll("mylabels")
       .data(years)
       .enter()
       .append("text")
       .attr("x", w - 70)
       .attr("y", (d, i) => 90 + i * 30)
       .style("fill", d => color(d))
       .text(d => d)
       .attr("text-anchor", "left")
       .style("alignment-baseline", "middle");
}

// Load all data from CSV initially
d3.csv("InfluenzaDeathOnset.csv").then(function(data) {
    data.forEach(d => d.COUNT = Math.min(+d.COUNT, maxCount));
    data = data.filter(d => (parseInt(d.AGE_GROUP) >= 1 && parseInt(d.AGE_GROUP) <= 30) || d.AGE_GROUP === "30+");
    var nestedData = d3.group(data, d => d.AGE_GROUP, d => d.YEAR);
    allData = Array.from(nestedData, ([age, years]) => {
        var counts = {};
        years.forEach((yearData, year) => {
            counts[year] = Math.min(yearData[0].COUNT, maxCount);
        });
        return { age, ...counts };
    });

    years = Array.from(new Set(data.map(d => d.YEAR)));
    allData.sort((a, b) => {
        if (a.age === "30+") return 1;
        if (b.age === "30+") return -1;
        return +a.age - +b.age;
    });

    displayedData = allData;
    ageGroups = displayedData.map(d => d.age);
    stackedData = displayedData;

    drawChart();
});

// Button functionality for filtering
function filterData(ageGroup) {
    if (ageGroup === "Show All") {
        stackedData = allData;
    } else {
        stackedData = allData.filter(data => data.age === ageGroup);
    }
    drawChart();
}

// Add button functionality
d3.select("#age0").on("click", function() { filterData("1"); });
d3.select("#age1").on("click", function() { filterData("2"); });
d3.select("#all").on("click", function() { filterData("Show All"); });
