import React, { useState } from "react";
import "./AnalysisApp.css";
import LineChart from "./components/analysis/LineChart/LineChart.jsx";
import LineChartConfig from "./components/analysis/configs/LineChartConfig.js";
import ScatterChart from "./components/analysis/ScatterChart/ScatterChart.jsx";
import ScatterChartConfig from "./components/analysis/configs/ScatterChartConfig.js";
import Modal from "./components/modal/Modal.jsx";
import DynamicForm from "./components/dynamicForm/DynamicForm.jsx";
import DynamicGrid from "./components/dynamicGrid/DynamicGrid.jsx";
import SidebarMenu from "./components/sidebarMenu/SidebarMenu.jsx";
import Table from "./components/table/Table.jsx";

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
      title: "Games",
      xLabel: "X Axis",
      yLabel: "Y Axis",
      showPoints: true,
      pointColor: "red",
      lineColor: "blue",
    }),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handler to update fieldConfig values in lineChartConfig
  const handleFieldConfigChange = (fieldName, newValue) => {
    setLineChartConfig((prevConfig) => {
      // Create a shallow copy of the config and fieldConfig
      const updatedConfig = Object.create(Object.getPrototypeOf(prevConfig));
      Object.assign(updatedConfig, prevConfig);
      updatedConfig.fieldConfig = { ...prevConfig.fieldConfig };
      // Update the value for the changed field
      updatedConfig.fieldConfig[fieldName] = {
        ...updatedConfig.fieldConfig[fieldName],
        value: newValue,
      };
      return updatedConfig;
    });
  };

  // Sample data for scatter chart
  const scatterData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
    { x: 6, y: 6 },
    { x: 7, y: 8 },
    { x: 7, y: 3 },
  ];

  const [scatterChartConfig] = useState(
    new ScatterChartConfig({
      data: scatterData,
      width: 500,
      height: 300,
      margin: { top: 40, right: 20, bottom: 30, left: 40 },
      pointSize: 8,
      pointColor: "green",
      title: "Scatter Chart",
      xLabel: "X Value",
      yLabel: "Y Value",
    }),
  );

  // Handler for table cell clicks
  const onCellClickHandler = (payload) => {
    alert(JSON.stringify(payload, null, 2));
    // Or use console.log(payload);
  };

  return (
    <div className="analysis-app-root">
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
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        position="right"
      >
        <DynamicForm
          config={lineChartConfig}
          onChange={handleFieldConfigChange}
        />
      </SidebarMenu>
      <DynamicGrid cellSize={80}></DynamicGrid>
      <LineChart config={lineChartConfig} />
      <ScatterChart config={scatterChartConfig} />
      <div style={{ margin: "32px 0" }}>
        <h3>Line Chart Data Table</h3>
        <Table data={sampleData} onCellClick={onCellClickHandler} />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></Modal>
    </div>
  );
}

export default AnalysisApp;
