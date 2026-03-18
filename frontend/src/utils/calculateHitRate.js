function getGameStatValue(game, stat) {
  const statKeyMap = {
    points: ["points", "PTS", "pts"],
    rebounds: ["rebounds", "REB", "reb"],
    assists: ["assists", "AST", "ast"],
    steals: ["steals", "STL", "stl"],
    blocks: ["blocks", "BLK", "blk"],
    turnovers: ["turnovers", "TOV", "tov"],
    FGM: ["FGM", "fgm"],
    FGA: ["FGA", "fga"],
    "3PM": ["FG3M", "fg3m", "3PM", "threePm"],
    "3PA": ["FG3A", "fg3a", "3PA", "threePa"],
    FTM: ["FTM", "ftm"],
    FTA: ["FTA", "fta"],
  };

  const possibleKeys = statKeyMap[stat] || [stat];

  for (const key of possibleKeys) {
    const rawValue = game[key];
    if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
      const numericValue = Number(rawValue);
      if (!Number.isNaN(numericValue)) {
        return numericValue;
      }
    }
  }

  return NaN;
}

export function calculateHitRate(games, stat, type, line) {
  if (!Array.isArray(games) || games.length === 0) {
    return {
      hits: 0,
      misses: 0,
      pushes: 0,
      total: 0,
      percentage: 0,
      average: 0,
    };
  }

  const numericLine = Number(line);
  if (Number.isNaN(numericLine)) {
    return {
      hits: 0,
      misses: 0,
      pushes: 0,
      total: 0,
      percentage: 0,
      average: 0,
    };
  }

  let hits = 0;
  let misses = 0;
  let pushes = 0;
  let totalValue = 0;
  let countedGames = 0;

  for (const game of games) {
    const value = getGameStatValue(game, stat);

    if (Number.isNaN(value)) continue;

    totalValue += value;
    countedGames += 1;

    if (type === "over") {
      if (value > numericLine) hits += 1;
      else if (value === numericLine) pushes += 1;
      else misses += 1;
    } else {
      if (value < numericLine) hits += 1;
      else if (value === numericLine) pushes += 1;
      else misses += 1;
    }
  }

  const percentage =
    countedGames > 0 ? Math.round((hits / countedGames) * 100) : 0;

  const average = countedGames > 0 ? (totalValue / countedGames).toFixed(1) : 0;

  return {
    hits,
    misses,
    pushes,
    total: countedGames,
    percentage,
    average,
  };
}
