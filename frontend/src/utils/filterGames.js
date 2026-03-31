function matchesThreshold(game, filter) {
  const statKey =
    filter?.stat || filter?.selectedStat || filter?.key || filter?.field;

  const operator = filter?.operator || filter?.comparison || ">=";
  const thresholdValue = Number(
    filter?.value ?? filter?.line ?? filter?.threshold ?? filter?.target,
  );

  const gameValue = Number(game?.[statKey]);

  if (!statKey) return true;
  if (!Number.isFinite(thresholdValue)) return true;
  if (!Number.isFinite(gameValue)) return false;

  switch (operator) {
    case ">":
      return gameValue > thresholdValue;
    case ">=":
      return gameValue >= thresholdValue;
    case "<":
      return gameValue < thresholdValue;
    case "<=":
      return gameValue <= thresholdValue;
    case "=":
    case "==":
      return gameValue === thresholdValue;
    default:
      return true;
  }
}

export function filterGames(games = [], filters = {}) {
  const locations = Array.isArray(filters.locations)
    ? filters.locations.map((value) => String(value).toLowerCase())
    : ["home", "away"];

  const results = Array.isArray(filters.results)
    ? filters.results.map((value) => String(value).toLowerCase())
    : ["win", "loss"];

  const opponentFilter = String(filters.opponent || "")
    .trim()
    .toLowerCase();

  const thresholdFilters = Array.isArray(filters.thresholds)
    ? filters.thresholds
    : [];

  return games.filter((game) => {
    const isHome = game.isHome === true;
    const isAway = game.isHome === false;

    const rawResult = String(game.result || game.wl || "").toLowerCase();
    const normalizedResult =
      rawResult === "w" ? "win" : rawResult === "l" ? "loss" : rawResult;

    const gameOpponent = String(game.opponent || "").toLowerCase();

    const matchesLocation =
      locations.length === 0 ||
      (locations.includes("home") && isHome) ||
      (locations.includes("away") && isAway);

    const matchesResult =
      results.length === 0 || results.includes(normalizedResult);

    const matchesOpponent =
      !opponentFilter || gameOpponent.includes(opponentFilter);

    const matchesAllThresholds = thresholdFilters.every((filter) =>
      matchesThreshold(game, filter),
    );

    return (
      matchesLocation &&
      matchesResult &&
      matchesOpponent &&
      matchesAllThresholds
    );
  });
}
