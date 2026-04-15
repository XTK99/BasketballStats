import React from "react";
import LineChart from "./components/analysis/LineChart.jsx";

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

  return (
    <div>
      <LineChart data={sampleData} />
    </div>
  );
}

export default AnalysisApp;
