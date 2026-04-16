import React, { useState } from "react";
import "./AnalysisApp.css";
import LineChart from "./components/analysis/LineChart.jsx";
import LineChartConfig from "./components/analysis/configs/LineChartConfig.js";
import Modal from "./components/modal/Modal.jsx";
import DynamicForm from "./components/dynamicForm/DynamicForm.jsx";
import DynamicGrid from "./components/dynamicGrid/DynamicGrid.jsx";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <DynamicForm />
      <DynamicGrid />
      <LineChart config={chartConfig} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></Modal>
    </div>
  );
}

export default AnalysisApp;
