var w = 800;
var h = 400;
var barPadding = 5;

var margin = { top: 20, right: 20, bottom: 50, left: 50 };
var innerWidth = w - margin.left - margin.right;
var innerHeight = h - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("display", "block")
            .style("margin", "0 auto");

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var currentYear;
var dataset = [];

d3.csv("OECD.csv").then(function(data) {
    data.forEach(d => {
        d.Year = +d.Year;
        d.Value = +d.Value;
    });

    dataset = data;
    var years = [...new Set(data.map(d => d.Year))];
    currentYear = years[0];

    d3.select("#yearSlider")
        .attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .attr("value", currentYear)
        .on("input", function() {
            currentYear = +this.value;
            drawBars(currentYear);
        });

    d3.select("#SortingAsc").on("click", () => sortBars("asc"));
    d3.select("#SortingDesc").on("click", () => sortBars("desc"));

    drawBars(currentYear);
});

function getDataByYear(year) {
    return dataset.filter(d => d.Year === year);
}

function drawBars(year, order = "default") {
    var data = getDataByYear(year);

    if (order === "asc") {
        data.sort((a, b) => a.Value - b.Value);
    } else if (order === "desc") {
        data.sort((a, b) => b.Value - a.Value);
    }

    var xscale = d3.scaleBand()
                   .domain(data.map(d => d.Country))
                   .range([0, innerWidth])
                   .paddingInner(0.05);

    var yscale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([innerHeight, 0]);

    var bars = chartGroup.selectAll("rect")
                         .data(data, d => d.Country);

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("x", d => xscale(d.Country))
        .attr("width", xscale.bandwidth())
        .attr("fill", "rgb(106,90,205)")
        .attr("y", innerHeight)
        .attr("height", 0)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "orange");

            var xPosition = parseFloat(d3.select(this).attr("x")) + xscale.bandwidth() / 2;
            var yPosition = yscale(d.Value) + 20;

            d3.select("#tooltip").remove();

            chartGroup.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(d.Value);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "rgb(106,90,205)");

            d3.select("#tooltip").remove();
        })
        .transition()
        .duration(2000)
        .ease(d3.easeBounce)
        .attr("y", d => yscale(d.Value))
        .attr("height", d => innerHeight - yscale(d.Value));

    bars.exit()
        .transition()
        .duration(2000)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove();

    var xAxis = d3.axisBottom(xscale);
    chartGroup.select(".x-axis")
              .attr("transform", `translate(0, ${innerHeight})`)
              .call(xAxis)
              .selectAll("text")
              .attr("transform", "rotate(-45)")
              .style("text-anchor", "end");

    var yAxis = d3.axisLeft(yscale).ticks(10);
    chartGroup.select(".y-axis")
              .call(yAxis);
}

function sortBars(order) {
    drawBars(currentYear, order);
}

chartGroup.append("g").attr("class", "x-axis");
chartGroup.append("g").attr("class", "y-axis");
