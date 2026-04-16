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
      <DynamicGrid cellSize={80}>
        <div
          style={{
            background: "#f87171",
            height: 80,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Red
        </div>
        <div
          style={{
            background: "#34d399",
            height: 80,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Green
        </div>
        <div
          style={{
            background: "#60a5fa",
            height: 80,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Blue
        </div>
        <div
          style={{
            background: "#fbbf24",
            height: 80,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Yellow
        </div>
        <div
          style={{
            background: "#a78bfa",
            height: 80,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Purple
        </div>
        <div
          style={{
            background: "#f472b6",
            height: 80,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Pink
        </div>
      </DynamicGrid>
      <LineChart config={chartConfig} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></Modal>
    </div>
  );
}

export default AnalysisApp;
