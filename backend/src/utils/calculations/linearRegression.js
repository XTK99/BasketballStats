// linearRegression.js
// Calculates least squares linear regression for an array of {x, y} points

/**
 * @param {Array<{x: number, y: number}>} data
 * @returns {Object} {
 *   xMin, yMin, xMax, yMax, slope, intercept, r2, n, meanX, meanY
 * }
 */
export function linearRegression(data) {
  if (!Array.isArray(data) || data.length < 2) {
    return null;
  }
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0,
    sumYY = 0;
  for (let i = 0; i < n; i++) {
    const { x, y } = data[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  // r^2 calculation
  let ssTot = 0,
    ssRes = 0;
  for (let i = 0; i < n; i++) {
    const { x, y } = data[i];
    const yPred = slope * x + intercept;
    ssTot += (y - meanY) ** 2;
    ssRes += (y - yPred) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  // Endpoints for regression line
  const xMin = Math.min(...data.map((d) => d.x));
  const xMax = Math.max(...data.map((d) => d.x));
  const yMin = slope * xMin + intercept;
  const yMax = slope * xMax + intercept;
  return {
    xMin,
    yMin,
    xMax,
    yMax,
    slope,
    intercept,
    r2,
    n,
    meanX,
    meanY,
  };
}
