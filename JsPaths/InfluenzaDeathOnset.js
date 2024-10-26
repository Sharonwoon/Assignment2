function init() {
    // Load the CSV data dynamically
    d3.csv("InfluenzaDeathOnset.csv").then(function(data) {
        
        // Process the CSV to keep only the rows where Characteristic is 'OnsetToDeath'
        data = data.filter(d => d.Characteristic === "OnsetToDeath");

        // Convert `Count` to a numeric type
        data.forEach(d => {
            d.Count = +d.Count;
        });

        // Create a nested structure for stacking
        const dataset = d3.nest()
            .key(d => d.Season)
            .entries(data);

        // Extract unique groups and counts for the stack keys
        const keys = [...new Set(data.map(d => d.Group))];

        var w = 500;
        var h = 300;
        var margin = { top: 20, right: 20, bottom: 30, left: 40 };
        
        var xscale = d3.scaleBand()
                         .domain(dataset.map(d => d.key))
                         .range([margin.left, w - margin.right])
                         .padding(0.1);

        var yscale = d3.scaleLinear()
                         .domain([0, d3.max(data, d => d.Count)])
                         .range([h - margin.bottom, margin.top]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Stack the data
        var series = d3.stack()
                         .keys(keys)
                         .value((d, key) => d.values.find(g => g.Group === key)?.Count || 0)
                         (dataset);

        var svg = d3.select("#stacked")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h);

        // Create groups for each series
        var groups = svg.selectAll("g")
                          .data(series)
                          .enter()
                          .append("g")
                          .style("fill", d => color(d.key));

        // Add the rects for each stacked value
        groups.selectAll("rect")
              .data(d => d)
              .enter()
              .append("rect")
              .attr("x", (d, i) => xscale(d.data.key))
              .attr("y", d => yscale(d[1]))
              .attr("height", d => yscale(d[0]) - yscale(d[1]))
              .attr("width", xscale.bandwidth());

        // Add dots for the legend
        svg.selectAll("mydots")
           .data(keys)
           .enter()
           .append("circle")
           .attr("cx", 20)
           .attr("cy", (d,i) => 50 + i*25)
           .attr("r", 7)
           .style("fill", d => color(d));

        // Add labels for the legend
        svg.selectAll("mylabels")
           .data(keys)
           .enter()
           .append("text")
           .attr("x", 40)
           .attr("y", (d,i) => 50 + i*25)
           .style("fill", d => color(d))
           .text(d => "Group " + d)
           .attr("text-anchor", "left")
           .style("alignment-baseline", "middle");
    });
}

window.onload = init;
