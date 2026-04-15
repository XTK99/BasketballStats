import React from "react";
import LineChart from "./components/analysis/LineChart.jsx";
import LineChartConfig from "./components/analysis/configs/LineChartConfig.js";

function AnalysisApp() {
  // Example data for the line chart
  const sampleData = [
    { x: 0, y: 5 },
    { x: 1, y: 9 },
    { x: 2, y: 7 },
    { x: 3, y: 12 },
    { x: 4, y: 8 },
    { x: 5, y: 15 },
    { x: 6, y: 10 },
  ];

  const chartConfig = new LineChartConfig({
    data: sampleData,
    width: 500,
    height: 300,
    title: "Sample Line Chart",
    xLabel: "X Axis",
    yLabel: "Y Axis",
    showPoints: true,
    pointColor: "red",
    lineColor: "blue",
  });

  return (
    <div>
      <LineChart config={chartConfig} />
    </div>
  );
}

export default AnalysisApp;
