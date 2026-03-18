function getValue(obj, keys, fallback = 0) {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return fallback;
}

function parseMatchup(matchup = "") {
  if (!matchup || typeof matchup !== "string") {
    return {
      opponent: "",
      isHome: null,
    };
  }

  if (matchup.includes(" vs. ")) {
    const parts = matchup.split(" vs. ");
    return {
      opponent: parts[1] || "",
      isHome: true,
    };
  }

  if (matchup.includes(" @ ")) {
    const parts = matchup.split(" @ ");
    return {
      opponent: parts[1] || "",
      isHome: false,
    };
  }

  return {
    opponent: "",
    isHome: null,
  };
}

export function normalizeGame(game) {
  const matchup = getValue(game, ["matchup", "MATCHUP"], "");
  const matchupInfo = parseMatchup(matchup);

  return {
    gameId: getValue(game, ["gameId", "GAME_ID", "Game_ID"], ""),
    gameDate: getValue(game, ["gameDate", "GAME_DATE", "date"], ""),
    matchup,
    opponent: matchupInfo.opponent,
    isHome: matchupInfo.isHome,
    wl: String(getValue(game, ["wl", "WL", "result"], "")).toUpperCase(),

    minutes: getValue(game, ["minutes", "MIN", "min"], 0),
    points: getValue(game, ["points", "PTS", "pts"], 0),
    rebounds: getValue(game, ["rebounds", "REB", "reb"], 0),
    assists: getValue(game, ["assists", "AST", "ast"], 0),
    steals: getValue(game, ["steals", "STL", "stl"], 0),
    blocks: getValue(game, ["blocks", "BLK", "blk"], 0),
    turnovers: getValue(game, ["turnovers", "TOV", "tov"], 0),

    fgm: getValue(game, ["fgm", "FGM", "fieldGoalsMade", "madeFieldGoals"], 0),

    fga: getValue(
      game,
      ["fga", "FGA", "fieldGoalsAttempted", "attemptedFieldGoals"],
      0,
    ),

    fgPct: getValue(
      game,
      [
        "fgPct",
        "fgPercent",
        "FG_PCT",
        "fieldGoalPct",
        "fieldGoalPercentage",
        "fieldGoalsPercentage",
      ],
      0,
    ),

    fg3m: getValue(
      game,
      [
        "fg3m",
        "FG3M",
        "FG3_M",
        "threePm",
        "3PM",
        "threesMade",
        "threePointersMade",
        "threePointsMade",
        "fg3Made",
      ],
      0,
    ),

    fg3a: getValue(
      game,
      [
        "fg3a",
        "FG3A",
        "FG3_A",
        "threePa",
        "3PA",
        "threesAttempted",
        "threePointersAttempted",
        "threePointsAttempted",
        "fg3Attempted",
      ],
      0,
    ),

    fg3Pct: getValue(
      game,
      [
        "fg3Pct",
        "threePct",
        "FG3_PCT",
        "threePointPct",
        "threePointPercentage",
        "threePointsPercentage",
      ],
      0,
    ),

    ftm: getValue(game, ["ftm", "FTM", "freeThrowsMade"], 0),

    fta: getValue(game, ["fta", "FTA", "freeThrowsAttempted"], 0),

    ftPct: getValue(
      game,
      [
        "ftPct",
        "ftPercent",
        "FT_PCT",
        "freeThrowPct",
        "freeThrowPercentage",
        "freeThrowsPercentage",
      ],
      0,
    ),
  };
}

export function normalizeGames(games = []) {
  return games.map(normalizeGame);
}
