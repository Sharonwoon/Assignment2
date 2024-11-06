function init() 
{
const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .range([height, 0]);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`);

svg.append("g")
    .attr("class", "y-axis");

function renderChart(data) {
    xScale.domain(data.map(d => d.country));
    yScale.domain([0, d3.max(data, d => d.value)]);

    svg.select(".x-axis")
        .call(d3.axisBottom(xScale));

    svg.select(".y-axis")
        .call(d3.axisLeft(yScale));

    const bars = svg.selectAll(".bar")
        .data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", d => xScale(d.country))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.value))
        .attr("height", d => height - yScale(d.value));

    bars.exit().remove();
}

function loadData(year) {
    d3.csv("OECD.csv").then(data => {
        const yearData = data
            .filter(d => +d.year === year)
            .map(d => ({
                year: +d.year,
                country: d.country,
                value: +d.value
            }));
        renderChart(yearData);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadData(2020);
});

}
window.onload = init
