const width = 1000; // Width of the donut chart SVG
const height = 600; // Height of the donut chart SVG
const radius = Math.min(width, height) / 2 - 10;

const svg = d3.select("#donut-chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create a div for the legend outside the chart area (in the HTML layout)
const legendContainer = d3.select("#chart-containnn").append("div")
    .attr("id", "legend-container") // Assign an id for easy selection
    .attr("class", "legend-container");

d3.csv("OECD.csv").then(data => {
    function updateChart(year) {
        const yearData = data.filter(d => d.Year == year);

        // Pie chart generator
        const pie = d3.pie()
            .value(d => +d.Value)
            .sort(null);

        // Arc generator for the donut shape
        const arc = d3.arc()
            .innerRadius(radius * 0.5) // Inner radius for the donut
            .outerRadius(radius);

        const paths = svg.selectAll("path")
            .data(pie(yearData), d => d.data.Country);

        paths.exit().remove();

        paths.enter().append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.Country))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.8);
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`<strong>${d.data.Country}</strong><br>Vaccination Rate: ${d.data.Value}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Update existing elements
        paths.transition().duration(750)
            .attrTween("d", function(d) {
                const i = d3.interpolate(this._current, d);
                this._current = i(0);
                return t => arc(i(t));
            });

        // Clear previous legend items to avoid duplication
        legendContainer.html(""); 

        // Create new legend items based on the current color scale
        const legendItems = legendContainer.selectAll(".legend-item")
            .data(colorScale.domain())
            .enter().append("div")
            .attr("class", "legend-item");

        legendItems.append("div")
            .attr("class", "legend-color-box")
            .style("background-color", d => colorScale(d));

        legendItems.append("span")
            .attr("class", "legend-text")
            .text(d => d);

        // Update the chart when the slider changes
        d3.select("#yearSlider").on("input", function() {
            const selectedYear = +this.value;
            d3.select("#selectedYear").text(selectedYear);
            updateChart(selectedYear);
        });
    }

    // Initial chart render for the default slider value
    updateChart(2020);
});
