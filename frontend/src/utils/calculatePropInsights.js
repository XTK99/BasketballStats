function getNumericStatValue(game, statKey) {
  const value = Number(game?.[statKey]);
  return Number.isFinite(value) ? value : null;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  if (!values.length) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function countHits(games, statKey, line) {
  let hits = 0;

  for (const game of games) {
    const value = getNumericStatValue(game, statKey);
    if (value !== null && value >= line) {
      hits += 1;
    }
  }

  return hits;
}

function buildSplit(label, games, statKey, line) {
  if (!games.length) {
    return {
      label,
      games: 0,
      hits: 0,
      hitRate: 0,
    };
  }

  const hits = countHits(games, statKey, line);
  const hitRate = (hits / games.length) * 100;

  return {
    label,
    games: games.length,
    hits,
    hitRate,
  };
}

export function calculatePropInsights({ games = [], statKey, line }) {
  if (!games.length || !statKey || !Number.isFinite(Number(line))) {
    return null;
  }

  const numericLine = Number(line);

  const statValues = games
    .map((game) => getNumericStatValue(game, statKey))
    .filter((value) => value !== null);

  if (!statValues.length) {
    return null;
  }

  const totalGames = statValues.length;
  const totalHits = statValues.filter((value) => value >= numericLine).length;
  const hitRate = totalGames ? (totalHits / totalGames) * 100 : 0;

  const last5Games = games.slice(0, 5);
  const last10Games = games.slice(0, 10);

  const homeGames = games.filter((game) => game.location === "Home");
  const awayGames = games.filter((game) => game.location === "Away");
  const winGames = games.filter((game) => game.result === "W");
  const lossGames = games.filter((game) => game.result === "L");

  const splits = [
    buildSplit("Home", homeGames, statKey, numericLine),
    buildSplit("Away", awayGames, statKey, numericLine),
    buildSplit("Wins", winGames, statKey, numericLine),
    buildSplit("Losses", lossGames, statKey, numericLine),
  ].filter((split) => split.games > 0);

  const bestSplit = splits.length
    ? [...splits].sort((a, b) => {
        if (b.hitRate !== a.hitRate) return b.hitRate - a.hitRate;
        return b.games - a.games;
      })[0]
    : null;

  const worstSplit = splits.length
    ? [...splits].sort((a, b) => {
        if (a.hitRate !== b.hitRate) return a.hitRate - b.hitRate;
        return b.games - a.games;
      })[0]
    : null;

  return {
    line: numericLine,
    totalGames,
    totalHits,
    hitRate,
    average: average(statValues),
    median: median(statValues),
    last5: buildSplit("Last 5", last5Games, statKey, numericLine),
    last10: buildSplit("Last 10", last10Games, statKey, numericLine),
    bestSplit,
    worstSplit,
  };
}
