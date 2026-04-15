// LineChartConfig.js
// Configuration class for D3 LineChart component

class LineChartConfig {
  constructor({
    data = [],
    width = 400,
    height = 200,
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    xLabel = "",
    yLabel = "",
    xScaleType = "linear", // or 'time', 'log', etc.
    yScaleType = "linear",
    lineColor = "steelblue",
    backgroundColor = "#fff",
    gridColor = "#eee",
    axisColor = "#333",
    lineWidth = 2,
    lineDash = "", // e.g., '4 2' for dashed
    curveType = "linear", // or 'basis', 'cardinal', etc.
    tooltip = true,
    tooltipFormat = null,
    gridLines = true,
    legend = false,
    legendPosition = "top-right",
    animation = false,
    animationDuration = 1000,
    animationEasing = "easeCubic",
    responsive = false,
    showPoints = false,
    pointShape = "circle",
    pointSize = 4,
    pointColor = "steelblue",
    title = "",
    subtitle = "",
    onPointClick = null,
    onPointHover = null,
  } = {}) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.xScaleType = xScaleType;
    this.yScaleType = yScaleType;
    this.lineColor = lineColor;
    this.backgroundColor = backgroundColor;
    this.gridColor = gridColor;
    this.axisColor = axisColor;
    this.lineWidth = lineWidth;
    this.lineDash = lineDash;
    this.curveType = curveType;
    this.tooltip = tooltip;
    this.tooltipFormat = tooltipFormat;
    this.gridLines = gridLines;
    this.legend = legend;
    this.legendPosition = legendPosition;
    this.animation = animation;
    this.animationDuration = animationDuration;
    this.animationEasing = animationEasing;
    this.responsive = responsive;
    this.showPoints = showPoints;
    this.pointShape = pointShape;
    this.pointSize = pointSize;
    this.pointColor = pointColor;
    this.title = title;
    this.subtitle = subtitle;
    this.onPointClick = onPointClick;
    this.onPointHover = onPointHover;
  }
}

export default LineChartConfig;
