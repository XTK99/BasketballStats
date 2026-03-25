function getValue(obj, keys, fallback = 0) {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return fallback;
}

function getNumberValue(obj, keys, fallback = 0) {
  const value = getValue(obj, keys, fallback);
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
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

function estimateGameStartTs(game) {
  const gameDate = getValue(game, ["date", "gameDate", "GAME_DATE"], "");
  const matchup = getValue(game, ["matchup", "MATCHUP"], "");

  if (!gameDate || !matchup) {
    return null;
  }

  const matchupInfo = parseMatchup(matchup);

  const hour12 = 7;
  const minute = matchupInfo.isHome ? 30 : 0;

  const parsed = new Date(
    `${gameDate} ${hour12}:${String(minute).padStart(2, "0")} PM`,
  );

  const ms = parsed.getTime();

  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
}

function normalizeGameStartTs(game) {
  const rawTs = getValue(
    game,
    [
      "gameStartTs",
      "GAME_START_TS",
      "game_start_ts",
      "startTimeUnix",
      "start_ts",
      "startTs",
    ],
    null,
  );

  if (rawTs !== null) {
    const num = Number(rawTs);
    return Number.isFinite(num) ? num : null;
  }

  const rawDateTime = getValue(
    game,
    [
      "gameDateTime",
      "GAME_DATE_TIME",
      "game_datetime",
      "startTime",
      "scheduledStart",
      "scheduledStartTime",
      "gameTimeUTC",
    ],
    null,
  );

  if (rawDateTime) {
    const ms = new Date(rawDateTime).getTime();
    if (Number.isFinite(ms)) {
      return Math.floor(ms / 1000);
    }
  }

  return null;
}

export function normalizeGame(game) {
  const matchup = getValue(game, ["matchup", "MATCHUP"], "");
  const matchupInfo = parseMatchup(matchup);

  const actualGameStartTs = normalizeGameStartTs(game);
  const estimatedGameStartTs = estimateGameStartTs(game);
  const finalGameStartTs = actualGameStartTs ?? estimatedGameStartTs;

  const wl = String(getValue(game, ["wl", "WL", "result"], "")).toUpperCase();

  const fg3m = getNumberValue(
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
      "fgm3",
      "FGM3",
      "threePointMade",
      "three_point_made",
    ],
    0,
  );

  const fg3a = getNumberValue(
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
  );

  const location =
    matchupInfo.isHome === true
      ? "home"
      : matchupInfo.isHome === false
        ? "away"
        : "";

  const result = wl === "W" ? "win" : wl === "L" ? "loss" : "";

  const teamId = getValue(game, ["teamId", "TEAM_ID", "team_id"], null);

  const teamAbbreviation = getValue(
    game,
    [
      "teamAbbreviation",
      "TEAM_ABBREVIATION",
      "team_abbreviation",
      "team",
      "TEAM",
    ],
    "",
  );

  const teamName = getValue(game, ["teamName", "TEAM_NAME", "team_name"], "");

  return {
    gameId: getValue(game, ["gameId", "GAME_ID", "Game_ID", "game_id"], ""),
    gameDate: getValue(
      game,
      ["gameDate", "GAME_DATE", "date", "game_date"],
      "",
    ),
    gameStartTs: finalGameStartTs,

    matchup,
    opponent: matchupInfo.opponent,
    isHome: matchupInfo.isHome,
    location,
    wl,
    result,

    teamId,
    teamName,
    team: teamAbbreviation,
    teamAbbreviation,

    minutes: getNumberValue(game, ["minutes", "MIN", "min"], 0),
    points: getNumberValue(game, ["points", "PTS", "pts"], 0),
    rebounds: getNumberValue(game, ["rebounds", "REB", "reb"], 0),
    assists: getNumberValue(game, ["assists", "AST", "ast"], 0),
    steals: getNumberValue(game, ["steals", "STL", "stl"], 0),
    blocks: getNumberValue(game, ["blocks", "BLK", "blk"], 0),
    turnovers: getNumberValue(game, ["turnovers", "TOV", "tov"], 0),

    teamScore: getNumberValue(
      game,
      ["teamScore", "TEAM_SCORE", "score", "teamPts"],
      0,
    ),

    opponentScore: getNumberValue(
      game,
      ["opponentScore", "OPPONENT_SCORE", "oppScore", "opponentPts", "OPP_PTS"],
      0,
    ),

    fgm: getNumberValue(
      game,
      ["fgm", "FGM", "fieldGoalsMade", "madeFieldGoals"],
      0,
    ),

    fga: getNumberValue(
      game,
      ["fga", "FGA", "fieldGoalsAttempted", "attemptedFieldGoals"],
      0,
    ),

    fgPct: getNumberValue(
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

    fg3m,
    fg3a,
    threesMade: fg3m,
    threesAttempted: fg3a,

    fg3Pct: getNumberValue(
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

    ftm: getNumberValue(game, ["ftm", "FTM", "freeThrowsMade"], 0),

    fta: getNumberValue(game, ["fta", "FTA", "freeThrowsAttempted"], 0),

    ftPct: getNumberValue(
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
