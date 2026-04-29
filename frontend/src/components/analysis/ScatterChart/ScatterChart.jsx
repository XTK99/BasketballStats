import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { linearRegression } from "../calculations";

// Expects a config prop (similar to LineChartConfig)
function ScatterChart({ config }) {
  const svgRef = useRef();

  // Destructure config.fieldConfig with defaults
  const data = config?.data || [];
  const fc = config?.fieldConfig || {};
  const width = fc.width?.value ?? 400;
  const height = fc.height?.value ?? 200;
  const margin = fc.margin?.value ?? {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40,
  };
  const pointSize = fc.pointSize?.value ?? 5;
  const pointColor = fc.pointColor?.value ?? "steelblue";
  const showLinearRegression = fc.showLinearRegression?.value ?? false;
  const title = fc.title?.value ?? "";
  const subtitle = fc.subtitle?.value ?? "";
  const xLabel = fc.xLabel?.value ?? "";
  const yLabel = fc.yLabel?.value ?? "";

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll("*").remove();

    // X scale
    const xDomain = d3.extent(data, (d) => d.x);
    const xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);

    // Y scale
    const yDomain = d3.extent(data, (d) => d.y);
    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(svgRef.current);

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Draw points
    svg
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", pointSize)
      .attr("fill", pointColor);

    // Draw linear regression line if enabled
    if (showLinearRegression && data.length > 1) {
      const reg = linearRegression(data);
      if (reg) {
        svg
          .append("line")
          .attr("x1", xScale(reg.xMin))
          .attr("y1", yScale(reg.yMin))
          .attr("x2", xScale(reg.xMax))
          .attr("y2", yScale(reg.yMax))
          .attr("stroke", "#e11d48")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "6 3");
        // Optionally, you could display reg.slope, reg.intercept, reg.r2, etc. as a legend or tooltip
      }
    }

    // Title
    if (title) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 1.5)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("dominant-baseline", "middle")
        .text(title);
    }
    // Subtitle
    if (subtitle) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("fill", "#666")
        .text(subtitle);
    }

    // Axis labels
    if (xLabel) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .text(xLabel);
    }
    if (yLabel) {
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .text(yLabel);
    }
  }, [
    data,
    width,
    height,
    margin,
    pointSize,
    pointColor,
    showLinearRegression,
    title,
    subtitle,
    xLabel,
    yLabel,
  ]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

export default ScatterChart;
