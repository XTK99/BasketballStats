// ScatterChartConfig.js
// Configuration class for D3 ScatterChart component

import FieldConfig from "../../dynamicForm/FieldConfig";

class ScatterChartConfig {
  constructor({
    // Data
    data = [],

    // Dimensions & Layout
    width = 400,
    height = 200,
    margin = { top: 40, right: 20, bottom: 30, left: 40 },

    // Axes
    xLabel = "",
    yLabel = "",

    // Appearance
    pointSize = 5,
    pointColor = "steelblue",
    title = "",
    subtitle = "",
    showLinearRegression = true,
  } = {}) {
    // Data
    this.data = data;

    // All FieldConfig objects grouped flat under fieldConfig
    this.fieldConfig = {
      width: new FieldConfig({
        name: "width",
        label: "Width",
        type: "number",
        value: width,
      }),
      height: new FieldConfig({
        name: "height",
        label: "Height",
        type: "number",
        value: height,
      }),
      margin: new FieldConfig({
        name: "margin",
        label: "Margin",
        type: "object",
        value: margin,
      }),
      xLabel: new FieldConfig({
        name: "xLabel",
        label: "X Axis Label",
        type: "text",
        value: xLabel,
      }),
      yLabel: new FieldConfig({
        name: "yLabel",
        label: "Y Axis Label",
        type: "text",
        value: yLabel,
      }),
      pointSize: new FieldConfig({
        name: "pointSize",
        label: "Point Size",
        type: "number",
        value: pointSize,
      }),
      pointColor: new FieldConfig({
        name: "pointColor",
        label: "Point Color",
        type: "color",
        value: pointColor,
      }),
      showLinearRegression: new FieldConfig({
        name: "showLinearRegression",
        label: "Show Linear Regression",
        type: "checkbox",
        value: showLinearRegression,
      }),
      title: new FieldConfig({
        name: "title",
        label: "Title",
        type: "text",
        value: title,
      }),
      subtitle: new FieldConfig({
        name: "subtitle",
        label: "Subtitle",
        type: "text",
        value: subtitle,
      }),
    };
  }
}

export default ScatterChartConfig;
