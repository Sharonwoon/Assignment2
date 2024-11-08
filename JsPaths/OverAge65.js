const boxSize = 65; // Size of each box
const padding = 20; // Padding between boxes
const legendHeight = 20;
const legendWidth = 400;
const titleOffset = 30;
const subtitleOffset = 25;
const legendOffset = 80;
const calendarOffset = 170; // Position calendar lower

const width = 1100; // Width of the SVG container
const height = 600; // Height of the SVG container
const svg = d3.select("#calendar-chart").attr("width", width).attr("height", height);
const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("OECD.csv").then(data => {
    const maxValue = d3.max(data, d => +d.Value);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxValue]);

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", titleOffset)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .text("Influenza Vaccination Rate for Age 65+");

    // Add subtitle
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", titleOffset + subtitleOffset)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#555")
        .text("Across major countries, showing vaccination coverage by year");

    // Add legend
    const legendX = (width - legendWidth) / 2;
    const legendY = legendOffset;

    // Define gradient for legend
    const legendGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradient");

    legendGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(0));
    legendGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", colorScale(maxValue / 2));
    legendGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(maxValue));

    // Draw the legend bar
    svg.append("rect")
        .attr("x", legendX)
        .attr("y", legendY)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legendGradient)");

    // Add legend labels
    svg.append("text")
        .attr("x", legendX)
        .attr("y", legendY + legendHeight + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("0%");

    svg.append("text")
        .attr("x", legendX + legendWidth / 2)
        .attr("y", legendY + legendHeight + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text((maxValue / 2).toFixed(1) + "%");

    svg.append("text")
        .attr("x", legendX + legendWidth)
        .attr("y", legendY + legendHeight + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(maxValue + "%");

    svg.append("text")
        .attr("x", legendX + legendWidth / 2)
        .attr("y", legendY - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text("Vaccination Rate (%)");

    // Render country boxes (calendar)
    function updateChart(year) {
        svg.selectAll(".country-box").remove(); // Clear previous chart elements

        const yearData = data.filter(d => d.Year == year);
        const columns = 12; // Number of columns to spread boxes evenly
        const yPos = calendarOffset; // Lowered position for calendar

        yearData.forEach((d, countryIndex) => {
            const xPos = (countryIndex % columns) * (boxSize + padding) + 20;
            const boxYPos = yPos + Math.floor(countryIndex / columns) * (boxSize + padding);

            // Country box with hover effect
            svg.append("rect")
                .attr("x", xPos)
                .attr("y", boxYPos)
                .attr("width", boxSize)
                .attr("height", boxSize)
                .attr("fill", colorScale(+d.Value))
                .attr("stroke", "#ccc")
                .attr("rx", 5) // Rounded corners
                .attr("class", "country-box")
                .on("mouseover", function(event) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`<strong>${d.Country}</strong><br>Vaccination Rate: ${d.Value}%`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px")
                        .style("background-color", "rgba(0, 0, 0, 0.7)")
                        .style("color", "#fff")
                        .style("padding", "8px")
                        .style("border-radius", "5px");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            // Add country names below each box
            svg.append("text")
                .attr("x", xPos + boxSize / 2)
                .attr("y", boxYPos + boxSize + 15)
                .attr("text-anchor", "middle")
                .attr("font-size", "11px")
                .attr("fill", "#333")
                .attr("class", "country-box")
                .text(d.Country);
        });
    }

    // Initial chart render for the default slider value
    updateChart(2020);

    // Update the chart when the slider changes
    d3.select("#yearSlider").on("input", function() {
        const selectedYear = +this.value;
        d3.select("#selectedYear").text(selectedYear); // Update displayed year
        updateChart(selectedYear);
    });
});
