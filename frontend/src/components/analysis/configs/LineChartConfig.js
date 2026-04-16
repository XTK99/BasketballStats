// LineChartConfig.js
// Configuration class for D3 LineChart component

import { DEFAULT_CURVE_TYPE, DEFAULT_SCALE_TYPE } from "./constants";
import { DEFAULT_POINT_SHAPE } from "./constants/pointShape";
import FieldConfig from "../../dynamicForm/FieldConfig";

// TODO: labelify all the types of this chart config

class LineChartConfig {
  constructor({
    // Data
    data = [],

    // Events
    onPointClick = null,
    onPointHover = null,

    // Tooltip
    tooltip = true,
    tooltipFormat = null,

    // Animation
    animation = false,
    animationDuration = 1000,
    animationEasing = "easeCubic",

    // Dimensions & Layout
    width = 400,
    height = 200,
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    responsive = false,

    // Axes
    xLabel = "",
    yLabel = "",
    xScaleType = DEFAULT_SCALE_TYPE,
    yScaleType = DEFAULT_SCALE_TYPE,

    // Appearance
    backgroundColor = "#fff",
    gridColor = "#eee",
    axisColor = "#333",
    gridLines = false,
    lineColor = "steelblue",
    lineWidth = 2,
    lineDash = "",
    curveType = DEFAULT_CURVE_TYPE,
    showPoints = false,
    pointShape = DEFAULT_POINT_SHAPE,
    pointSize = 4,
    pointColor = "steelblue",
    title = "",
    subtitle = "",

    // Legend
    legend = false,
    legendPosition = "top-right",
  } = {}) {
    // Data
    this.data = data;

    // All FieldConfig objects grouped flat under fieldConfig
    this.fieldConfig = {
      // Events
      onPointClick: new FieldConfig({
        name: "onPointClick",
        label: "On Point Click",
        type: "function",
        defaultValue: null,
        value: onPointClick,
      }),
      onPointHover: new FieldConfig({
        name: "onPointHover",
        label: "On Point Hover",
        type: "function",
        defaultValue: null,
        value: onPointHover,
      }),
      // Tooltip
      tooltip: new FieldConfig({
        name: "tooltip",
        label: "Show Tooltip",
        type: "checkbox",
        defaultValue: true,
        value: tooltip,
      }),
      tooltipFormat: new FieldConfig({
        name: "tooltipFormat",
        label: "Tooltip Format",
        type: "text",
        defaultValue: null,
        value: tooltipFormat,
      }),
      // Animation
      animation: new FieldConfig({
        name: "animation",
        label: "Enable Animation",
        type: "checkbox",
        defaultValue: false,
        value: animation,
      }),
      animationDuration: new FieldConfig({
        name: "animationDuration",
        label: "Animation Duration (ms)",
        type: "number",
        defaultValue: 1000,
        value: animationDuration,
      }),
      animationEasing: new FieldConfig({
        name: "animationEasing",
        label: "Animation Easing",
        type: "text",
        defaultValue: "easeCubic",
        value: animationEasing,
      }),
      // Dimensions & Layout
      width: new FieldConfig({
        name: "width",
        label: "Width",
        type: "number",
        defaultValue: 400,
        value: width,
      }),
      height: new FieldConfig({
        name: "height",
        label: "Height",
        type: "number",
        defaultValue: 200,
        value: height,
      }),
      margin: new FieldConfig({
        name: "margin",
        label: "Margin",
        type: "object",
        defaultValue: { top: 20, right: 20, bottom: 30, left: 40 },
        value: margin,
      }),
      responsive: new FieldConfig({
        name: "responsive",
        label: "Responsive",
        type: "checkbox",
        defaultValue: false,
        value: responsive,
      }),
      // Axes
      xLabel: new FieldConfig({
        name: "xLabel",
        label: "X Axis Label",
        type: "text",
        defaultValue: "",
        value: xLabel,
      }),
      yLabel: new FieldConfig({
        name: "yLabel",
        label: "Y Axis Label",
        type: "text",
        defaultValue: "",
        value: yLabel,
      }),
      xScaleType: new FieldConfig({
        name: "xScaleType",
        label: "X Scale Type",
        type: "select",
        defaultValue: DEFAULT_SCALE_TYPE,
        value: xScaleType,
      }),
      yScaleType: new FieldConfig({
        name: "yScaleType",
        label: "Y Scale Type",
        type: "select",
        defaultValue: DEFAULT_SCALE_TYPE,
        value: yScaleType,
      }),
      // Appearance
      backgroundColor: new FieldConfig({
        name: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "#fff",
        value: backgroundColor,
      }),
      gridColor: new FieldConfig({
        name: "gridColor",
        label: "Grid Color",
        type: "color",
        defaultValue: "#eee",
        value: gridColor,
      }),
      axisColor: new FieldConfig({
        name: "axisColor",
        label: "Axis Color",
        type: "color",
        defaultValue: "#333",
        value: axisColor,
      }),
      gridLines: new FieldConfig({
        name: "gridLines",
        label: "Show Grid Lines",
        type: "checkbox",
        defaultValue: false,
        value: gridLines,
      }),
      lineColor: new FieldConfig({
        name: "lineColor",
        label: "Line Color",
        type: "color",
        defaultValue: "steelblue",
        value: lineColor,
      }),
      lineWidth: new FieldConfig({
        name: "lineWidth",
        label: "Line Width",
        type: "number",
        defaultValue: 2,
        value: lineWidth,
      }),
      lineDash: new FieldConfig({
        name: "lineDash",
        label: "Line Dash",
        type: "text",
        defaultValue: "",
        value: lineDash,
      }),
      curveType: new FieldConfig({
        name: "curveType",
        label: "Curve Type",
        type: "select",
        defaultValue: DEFAULT_CURVE_TYPE,
        value: curveType,
      }),
      showPoints: new FieldConfig({
        name: "showPoints",
        label: "Show Points",
        type: "checkbox",
        defaultValue: false,
        value: showPoints,
      }),
      pointShape: new FieldConfig({
        name: "pointShape",
        label: "Point Shape",
        type: "select",
        defaultValue: DEFAULT_POINT_SHAPE,
        value: pointShape,
      }),
      pointSize: new FieldConfig({
        name: "pointSize",
        label: "Point Size",
        type: "number",
        defaultValue: 4,
        value: pointSize,
      }),
      pointColor: new FieldConfig({
        name: "pointColor",
        label: "Point Color",
        type: "color",
        defaultValue: "steelblue",
        value: pointColor,
      }),
      title: new FieldConfig({
        name: "title",
        label: "Title",
        type: "text",
        defaultValue: "",
        value: title,
      }),
      subtitle: new FieldConfig({
        name: "subtitle",
        label: "Subtitle",
        type: "text",
        defaultValue: "",
        value: subtitle,
      }),
      // Legend
      legend: new FieldConfig({
        name: "legend",
        label: "Show Legend",
        type: "checkbox",
        defaultValue: false,
        value: legend,
      }),
      legendPosition: new FieldConfig({
        name: "legendPosition",
        label: "Legend Position",
        type: "select",
        defaultValue: "top-right",
        value: legendPosition,
      }),
    };
  }
}

export default LineChartConfig;
