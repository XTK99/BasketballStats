export function generateThresholds(stat) {
  if (stat === "points") {
    return [10, 15, 20, 25, 30, 35, 40, 45, 50];
  }

  if (stat === "assists") {
    return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  }

  if (stat === "rebounds") {
    return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  }

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
