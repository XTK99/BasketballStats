export function generateThresholds(stat, mode = "player") {
  if (mode === "team") {
    switch (stat) {
      case "points":
        return [95, 100, 105, 110, 115, 120, 125, 130];
      case "rebounds":
        return [38, 42, 46, 50, 54, 58];
      case "assists":
        return [20, 23, 26, 29, 32];
      case "steals":
        return [6, 7, 8, 9, 10, 11];
      case "blocks":
        return [4, 5, 6, 7, 8, 9];
      case "turnovers":
        return [10, 12, 14, 16, 18, 20];
      case "minutes":
        return [225, 230, 235, 240];
      case "threesMade":
        return [9, 11, 13, 15, 17, 19, 21];
      default:
        return [];
    }
  }

  switch (stat) {
    case "points":
      return [10, 15, 20, 25, 30, 35, 40, 45, 50];
    case "rebounds":
      return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    case "assists":
      return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    case "steals":
      return [1, 2, 3, 4, 5];
    case "blocks":
      return [1, 2, 3, 4, 5];
    case "turnovers":
      return [2, 3, 4, 5, 6];
    case "minutes":
      return [20, 25, 30, 35, 40];
    case "threesMade":
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    default:
      return [];
  }
}
