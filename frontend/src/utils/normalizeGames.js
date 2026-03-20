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

const TEAM_TIMEZONES = {
  ATL: "America/New_York",
  BOS: "America/New_York",
  BKN: "America/New_York",
  CHA: "America/New_York",
  CHI: "America/Chicago",
  CLE: "America/New_York",
  DAL: "America/Chicago",
  DEN: "America/Denver",
  DET: "America/New_York",
  GSW: "America/Los_Angeles",
  HOU: "America/Chicago",
  IND: "America/Indiana/Indianapolis",
  LAC: "America/Los_Angeles",
  LAL: "America/Los_Angeles",
  MEM: "America/Chicago",
  MIA: "America/New_York",
  MIL: "America/Chicago",
  MIN: "America/Chicago",
  NOP: "America/Chicago",
  NYK: "America/New_York",
  OKC: "America/Chicago",
  ORL: "America/New_York",
  PHI: "America/New_York",
  PHX: "America/Phoenix",
  POR: "America/Los_Angeles",
  SAC: "America/Los_Angeles",
  SAS: "America/Chicago",
  TOR: "America/Toronto",
  UTA: "America/Denver",
  WAS: "America/New_York",
};

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

  const normalized = {
    gameId: getValue(game, ["gameId", "GAME_ID", "Game_ID"], ""),
    gameDate: getValue(game, ["gameDate", "GAME_DATE", "date"], ""),
    gameStartTs: finalGameStartTs,

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

    teamScore: getValue(
      game,
      ["teamScore", "TEAM_SCORE", "score", "teamPts"],
      null,
    ),

    opponentScore: getValue(
      game,
      ["opponentScore", "OPPONENT_SCORE", "oppScore", "opponentPts", "OPP_PTS"],
      null,
    ),

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

  return normalized;
}

export function normalizeGames(games = []) {
  const normalizedGames = games.map(normalizeGame);
  return normalizedGames;
}
