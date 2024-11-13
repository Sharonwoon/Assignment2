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

// Define a custom color scale with 36 colors
const colorPalette = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b",
    "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#aec7e8", "#ffbb78",
    "#98df8a", "#ff9896", "#c5b0d5", "#c49c94", "#f7b6d2", "#c7c7c7",
    "#dbdb8d", "#9edae5", "#393b79", "#5254a3", "#6b6ecf", "#9c9ede",
    "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39",
    "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c"
];

const colorScale = d3.scaleOrdinal()
    .range(colorPalette);

const legendContainer = d3.select("#chart-containnn").append("div")
    .attr("id", "legend-container")
    .attr("class", "legend-container");

d3.csv("CSV_files/OECD.csv").then(data => {
    function updateChart(year) {
        const yearData = data.filter(d => d.Year == year);

        const pie = d3.pie()
            .value(d => +d.Value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius);

        const paths = svg.selectAll("path")
            .data(pie(yearData), d => d.data.Country);

        paths.exit().remove();

        paths.enter().append("path")
            .attr("fill", d => colorScale(d.data.Country))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .each(function(d) { this._current = { startAngle: 0, endAngle: 0 }; }) // Initial state for animation
            .transition() // Animation for drawing the segments
            .duration(1000)
            .attrTween("d", function(d) {
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(1);
                return t => arc(interpolate(t));
            });

        // Hover effect for each path
        svg.selectAll("path")
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

        paths.transition().duration(750)
            .attrTween("d", function(d) {
                const i = d3.interpolate(this._current, d);
                this._current = i(0);
                return t => arc(i(t));
            });

        legendContainer.html("");

        const legendItems = legendContainer.selectAll(".legend-item")
            .data(yearData.map(d => d.Country))
            .enter().append("div")
            .attr("class", "legend-item");

        legendItems.append("div")
            .attr("class", "legend-color-box")
            .style("background-color", d => colorScale(d));

        legendItems.append("span")
            .attr("class", "legend-text")
            .text(d => d);

        d3.select("#yearSlider").on("input", function() {
            const selectedYear = +this.value;
            d3.select("#selectedYear").text(selectedYear);
            updateChart(selectedYear);
        });
    }

    updateChart(2020);
});
