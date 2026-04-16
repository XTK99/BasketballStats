import React, { useState } from "react";
import "./AnalysisApp.css";
import LineChart from "./components/analysis/LineChart.jsx";
import LineChartConfig from "./components/analysis/configs/LineChartConfig.js";
import Modal from "./components/modal/Modal.jsx";
import DynamicForm from "./components/dynamicForm/DynamicForm.jsx";
import DynamicGrid from "./components/dynamicGrid/DynamicGrid.jsx";
import SidebarMenu from "./components/sidebarMenu/SidebarMenu.jsx";

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

  const [lineChartConfig, setLineChartConfig] = useState(
    new LineChartConfig({
      data: sampleData,
      width: 500,
      height: 300,
      title: "Sample Line Chart",
      xLabel: "X Axis",
      yLabel: "Y Axis",
      showPoints: true,
      pointColor: "red",
      lineColor: "blue",
    }),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <button
        style={{
          margin: "16px 0",
          padding: "8px 18px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        onClick={() => setIsSidebarOpen((open) => !open)}
      >
        {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
      <SidebarMenu
        open={true}
        onClose={() => setIsSidebarOpen(false)}
        position="right"
      >
        <DynamicForm config={lineChartConfig} />
      </SidebarMenu>
      <DynamicGrid cellSize={80}></DynamicGrid>
      <LineChart config={lineChartConfig} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></Modal>
    </div>
  );
}

export default AnalysisApp;
