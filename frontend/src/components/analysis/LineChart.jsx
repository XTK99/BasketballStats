import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Expects data as array of objects: [{x:..., y:...}, ...]
function LineChart({ data = [], width = 400, height = 200 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([40, width - 20]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)])
      .range([height - 30, 20]);

    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    const svg = d3.select(svgRef.current);

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - 30})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(40,0)`)
      .call(d3.axisLeft(yScale));

    // Draw line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data, width, height]);

  return (
    <div>
      <h2>Line Chart (D3)</h2>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

export default LineChart;
