function getGameStatValue(game, stat) {
  const statKeyMap = {
    points: ["points", "PTS", "pts"],
    rebounds: ["rebounds", "REB", "reb"],
    assists: ["assists", "AST", "ast"],
    steals: ["steals", "STL", "stl"],
    blocks: ["blocks", "BLK", "blk"],
    turnovers: ["turnovers", "TOV", "tov"],

    FGM: ["FGM", "fgm", "fieldGoalsMade", "field_goals_made", "madeFieldGoals"],
    FGA: [
      "FGA",
      "fga",
      "fieldGoalsAttempted",
      "field_goals_attempted",
      "attemptedFieldGoals",
    ],
    "3PM": [
      "FG3M",
      "fg3m",
      "3PM",
      "threePm",
      "threesMade",
      "threePointersMade",
      "madeThrees",
    ],
    "3PA": [
      "FG3A",
      "fg3a",
      "3PA",
      "threePa",
      "threesAttempted",
      "threePointersAttempted",
      "attemptedThrees",
    ],
    FTM: ["FTM", "ftm", "freeThrowsMade"],
    FTA: ["FTA", "fta", "freeThrowsAttempted"],
  };

  const possibleKeys = statKeyMap[stat] || [stat];

  for (const key of possibleKeys) {
    const rawValue = game?.[key];

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      continue;
    }

    const numericValue = Number(rawValue);

    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }
  }

  return NaN;
}

function calculateMiniHitRate(games, stat, line) {
  if (!Array.isArray(games) || games.length === 0) {
    return {
      hits: 0,
      total: 0,
      percentage: 0,
    };
  }

  let hits = 0;
  let total = 0;

  for (const game of games) {
    const value = getGameStatValue(game, stat);

    if (Number.isNaN(value)) continue;

    total += 1;

    if (value >= line) {
      hits += 1;
    }
  }

  return {
    hits,
    total,
    percentage: total > 0 ? Math.round((hits / total) * 100) : 0,
  };
}

export function calculateHitRateForLine(games, stat, line) {
  if (!Array.isArray(games) || games.length === 0) {
    return {
      line,
      hits: 0,
      misses: 0,
      pushes: 0,
      total: 0,
      percentage: 0,
      last5: { hits: 0, total: 0, percentage: 0 },
      last10: { hits: 0, total: 0, percentage: 0 },
    };
  }

  let hits = 0;
  let misses = 0;
  let pushes = 0;
  let total = 0;

  for (const game of games) {
    const value = getGameStatValue(game, stat);

    if (Number.isNaN(value)) continue;

    total += 1;

    if (value >= line) {
      hits += 1;
    } else {
      misses += 1;
    }
  }

  const validGames = games.filter(
    (game) => !Number.isNaN(getGameStatValue(game, stat)),
  );
  const last5Games = validGames.slice(0, 5);
  const last10Games = validGames.slice(0, 10);

  return {
    line,
    hits,
    misses,
    pushes,
    total,
    percentage: total > 0 ? Math.round((hits / total) * 100) : 0,
    last5: calculateMiniHitRate(last5Games, stat, line),
    last10: calculateMiniHitRate(last10Games, stat, line),
  };
}

export function calculateHitRateBoard(games, stat, thresholds) {
  if (!Array.isArray(thresholds)) return [];
  return thresholds.map((line) => calculateHitRateForLine(games, stat, line));
}
