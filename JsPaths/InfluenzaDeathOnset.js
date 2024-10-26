function init() {
    var w = 800;
    var h = 400;
    var margin = { top: 50, right: 120, bottom: 70, left: 70 };

    var xscale = d3.scaleBand()
                   .range([margin.left, w - margin.right])
                   .padding(0.1);

    var yscale = d3.scaleLinear()
                   .range([h - margin.bottom, margin.top]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#stacked")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    d3.csv("InfluenzaDeathOnset.csv").then(function(data) {
        // Convert COUNT to numeric
        data.forEach(d => d.COUNT = +d.COUNT);

        // Group data by AGE_GROUP, then by YEAR within each AGE_GROUP
        var nestedData = d3.group(data, d => d.AGE_GROUP, d => d.YEAR);

        // Create an array of unique age groups and years for domain setting
        var ageGroups = Array.from(nestedData.keys()).sort((a, b) => {
            if (a === "30+") return 1;
            if (b === "30+") return -1;
            return +a - +b;
        });
        var years = Array.from(new Set(data.map(d => d.YEAR)));

        // Stack data for each year by age group
        var stackedData = ageGroups.map(age => {
            var counts = {};
            years.forEach(year => {
                counts[year] = (nestedData.get(age)?.get(year)?.[0]?.COUNT) || 0;
            });
            return { age, ...counts };
        });

        // Define the stack keys (years) and stack layout
        var series = d3.stack()
                       .keys(years)
                       (stackedData);

        xscale.domain(ageGroups);
        yscale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);

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
    });
}

window.onload = init;
