const w = 800;
        const h = 400;
        const padding = 50;

        // SVG canvas
        const svg = d3.select("article.content")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("border", "1px solid black");  // Debugging border

        // Define symbols for different age groups
        const symbolCircle = d3.symbol().type(d3.symbolCircle).size(100);
        const symbolTriangle = d3.symbol().type(d3.symbolTriangle).size(100);
        const symbolDiamond = d3.symbol().type(d3.symbolDiamond).size(100);

        // Function to determine the symbol based on age group
        function getSymbol(ageGroup) {
            if (ageGroup === "<5 years") return symbolCircle();
            else if (ageGroup === "5-64 years") return symbolTriangle();
            else return symbolDiamond();
        }

        // Function to calculate the average of a range in the format "x–y"
        function parseRange(rangeStr) {
            if (rangeStr.includes("–")) {
                const [min, max] = rangeStr.split("–").map(Number);
                return (min + max) / 2;
            }
            return +rangeStr;  // For single values, just convert to number
        }

        // Load data from CSV file
        d3.csv("InfluenzaHospitalization.csv").then(data => {
            console.log("Data loaded:", data);  // Debugging log for loaded data

            // Convert data fields to appropriate types
            data.forEach(d => {
                d.year = parseInt(d.Years.replace("–", "-").split("-")[0]);  // Use the first year in range
                d.rateUnder5 = parseRange(d["Aged <5 years"]);
                d.rate5To64 = parseRange(d["Aged 5- 64 years"]);
                d.rate65Plus = parseRange(d["Aged 65 years"]);
            });

            // Flatten data for easier plotting
            const flattenedData = [];
            data.forEach(d => {
                if (d.Years) {
                    d.year = parseInt(d.Years.replace("–", "-").split("-")[0]);
                } else {
                    console.warn("Missing 'Years' value in row:", d);
                    d.year = null;  // or some default value, if you prefer
                }
                d.rateUnder5 = d["Aged <5 years"] ? parseRange(d["Aged <5 years"]) : null;
                d.rate5To64 = d["Aged 5- 64 years"] ? parseRange(d["Aged 5- 64 years"]) : null;
                d.rate65Plus = d["Aged 65 years"] ? parseRange(d["Aged 65 years"]) : null;
            });

            // Scales based on data
            const xScale = d3.scaleLinear()
                .domain(d3.extent(flattenedData, d => d.year))
                .range([padding, w - padding]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(flattenedData, d => d.rate) + 50])
                .range([h - padding, padding]);

            // Plot symbols on the SVG
            svg.selectAll("path")
                .data(flattenedData)
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
                .attr("y", 40)
                .attr("fill", "black")
                .text("Year");

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${padding}, 0)`)
                .call(yAxis)
                .append("text")
                .attr("x", -padding)
                .attr("y", padding / 2)
                .attr("fill", "black")
                .text("Rate per 100,000");

            // Legend
            const legendData = [
                { ageGroup: "<5 years", symbol: symbolCircle(), color: "black" },
                { ageGroup: "5-64 years", symbol: symbolTriangle(), color: "gray" },
                { ageGroup: "≥65 years", symbol: symbolDiamond(), color: "darkgray" }
            ];

            const legend = svg.selectAll(".legend")
                .data(legendData)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${w - padding * 3}, ${padding + i * 20})`);

            legend.append("path")
                .attr("d", d => d.symbol)
                .attr("fill", d => d.color);

            legend.append("text")
                .attr("x", 20)
                .attr("y", 5)
                .text(d => d.ageGroup);
        }).catch(error => {
            console.error("Error loading the CSV file:", error);
        });