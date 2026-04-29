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
    margin = { top: 40, right: 20, bottom: 40, left: 40 },
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
        value: onPointClick,
      }),
      onPointHover: new FieldConfig({
        name: "onPointHover",
        label: "On Point Hover",
        type: "function",
        value: onPointHover,
      }),
      // Tooltip
      tooltip: new FieldConfig({
        name: "tooltip",
        label: "Show Tooltip",
        type: "checkbox",
        value: tooltip,
      }),
      tooltipFormat: new FieldConfig({
        name: "tooltipFormat",
        label: "Tooltip Format",
        type: "text",
        value: tooltipFormat,
      }),
      // Animation
      animation: new FieldConfig({
        name: "animation",
        label: "Enable Animation",
        type: "checkbox",
        value: animation,
      }),
      animationDuration: new FieldConfig({
        name: "animationDuration",
        label: "Animation Duration (ms)",
        type: "number",
        value: animationDuration,
      }),
      animationEasing: new FieldConfig({
        name: "animationEasing",
        label: "Animation Easing",
        type: "text",
        value: animationEasing,
      }),
      // Dimensions & Layout
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
      responsive: new FieldConfig({
        name: "responsive",
        label: "Responsive",
        type: "checkbox",
        value: responsive,
      }),
      // Axes
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
      xScaleType: new FieldConfig({
        name: "xScaleType",
        label: "X Scale Type",
        type: "select",
        value: xScaleType,
      }),
      yScaleType: new FieldConfig({
        name: "yScaleType",
        label: "Y Scale Type",
        type: "select",
        value: yScaleType,
      }),
      // Appearance
      backgroundColor: new FieldConfig({
        name: "backgroundColor",
        label: "Background Color",
        type: "color",
        value: backgroundColor,
      }),
      gridColor: new FieldConfig({
        name: "gridColor",
        label: "Grid Color",
        type: "color",
        value: gridColor,
      }),
      axisColor: new FieldConfig({
        name: "axisColor",
        label: "Axis Color",
        type: "color",
        value: axisColor,
      }),
      gridLines: new FieldConfig({
        name: "gridLines",
        label: "Show Grid Lines",
        type: "checkbox",
        value: gridLines,
      }),
      lineColor: new FieldConfig({
        name: "lineColor",
        label: "Line Color",
        type: "color",
        value: lineColor,
      }),
      lineWidth: new FieldConfig({
        name: "lineWidth",
        label: "Line Width",
        type: "number",
        value: lineWidth,
      }),
      lineDash: new FieldConfig({
        name: "lineDash",
        label: "Line Dash",
        type: "text",
        value: lineDash,
      }),
      curveType: new FieldConfig({
        name: "curveType",
        label: "Curve Type",
        type: "select",
        value: curveType,
      }),
      showPoints: new FieldConfig({
        name: "showPoints",
        label: "Show Points",
        type: "checkbox",
        value: showPoints,
      }),
      pointShape: new FieldConfig({
        name: "pointShape",
        label: "Point Shape",
        type: "select",
        value: pointShape,
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
      // Legend
      legend: new FieldConfig({
        name: "legend",
        label: "Show Legend",
        type: "checkbox",
        value: legend,
      }),
      legendPosition: new FieldConfig({
        name: "legendPosition",
        label: "Legend Position",
        type: "select",
        value: legendPosition,
      }),
    };
  }
}

export default LineChartConfig;
