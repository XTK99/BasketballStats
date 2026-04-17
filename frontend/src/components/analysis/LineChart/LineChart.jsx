import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Now expects a single prop: config (instance of LineChartConfig)
function LineChart({ config }) {
  const svgRef = useRef();

  // Destructure config.fieldConfig with defaults
  const data = config?.data || [];
  const fc = config?.fieldConfig || {};
  const width = fc.width?.value ?? 400;
  const height = fc.height?.value ?? 200;
  // Increase top margin to make space for title
  const margin = fc.margin?.value ?? {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40,
  };
  const lineColor = fc.lineColor?.value ?? "steelblue";
  const lineWidth = fc.lineWidth?.value ?? 2;
  const lineDash = fc.lineDash?.value ?? "";
  const xScaleType = fc.xScaleType?.value ?? "linear";
  const yScaleType = fc.yScaleType?.value ?? "linear";
  const gridLines = fc.gridLines?.value ?? true;
  const showPoints = fc.showPoints?.value ?? false;
  const pointSize = fc.pointSize?.value ?? 4;
  const pointColor = fc.pointColor?.value ?? "steelblue";
  const title = fc.title?.value ?? "";
  const xLabel = fc.xLabel?.value ?? "";
  const yLabel = fc.yLabel?.value ?? "";

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll("*").remove();

    // X scale
    const xDomain = d3.extent(data, (d) => d.x);
    const xScale =
      xScaleType === "time"
        ? d3.scaleTime().domain(xDomain)
        : d3.scaleLinear().domain(xDomain);
    xScale.range([margin.left, width - margin.right]);

    // Y scale
    const yDomain = [d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)];
    const yScale =
      yScaleType === "log"
        ? d3.scaleLog().domain(yDomain)
        : d3.scaleLinear().domain(yDomain);
    yScale.range([height - margin.bottom, margin.top]);

    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    const svg = d3.select(svgRef.current);

    // Grid lines
    if (gridLines) {
      svg
        .append("g")
        .attr("class", "grid x-grid")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(-(height - margin.top - margin.bottom))
            .tickFormat(""),
        );
      svg
        .append("g")
        .attr("class", "grid y-grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-(width - margin.left - margin.right))
            .tickFormat(""),
        );
    }

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Draw line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", lineWidth)
      .attr("stroke-dasharray", lineDash)
      .attr("d", line);

    // Draw points if enabled
    if (showPoints) {
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
    }

    // Title
    if (title) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 1.5) // Move title further down from the top
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("dominant-baseline", "middle")
        .text(title);
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
    lineColor,
    lineWidth,
    lineDash,
    xScaleType,
    yScaleType,
    gridLines,
    showPoints,
    pointSize,
    pointColor,
    title,
    xLabel,
    yLabel,
  ]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

export default LineChart;
