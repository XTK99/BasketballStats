const teamNameMap = {
  ATL: "atlanta hawks",
  BOS: "boston celtics",
  BKN: "brooklyn nets",
  CHA: "charlotte hornets",
  CHI: "chicago bulls",
  CLE: "cleveland cavaliers",
  DAL: "dallas mavericks",
  DEN: "denver nuggets",
  DET: "detroit pistons",
  GSW: "golden state warriors",
  HOU: "houston rockets",
  IND: "indiana pacers",
  LAC: "los angeles clippers",
  LAL: "los angeles lakers",
  MEM: "memphis grizzlies",
  MIA: "miami heat",
  MIL: "milwaukee bucks",
  MIN: "minnesota timberwolves",
  NOP: "new orleans pelicans",
  NYK: "new york knicks",
  OKC: "oklahoma city thunder",
  ORL: "orlando magic",
  PHI: "philadelphia 76ers",
  PHX: "phoenix suns",
  POR: "portland trail blazers",
  SAC: "sacramento kings",
  SAS: "san antonio spurs",
  TOR: "toronto raptors",
  UTA: "utah jazz",
  WAS: "washington wizards",
};

function compareValue(gameValue, operator, filterValue) {
  switch (operator) {
    case ">":
      return gameValue > filterValue;
    case ">=":
      return gameValue >= filterValue;
    case "<":
      return gameValue < filterValue;
    case "<=":
      return gameValue <= filterValue;
    case "=":
      return gameValue === filterValue;
    default:
      return true;
  }
}

function getOpponentFromMatchup(matchup) {
  if (!matchup) return "";
  const parts = String(matchup).trim().split(/\s+/);
  return parts[2] || "";
}

function getOpponentSearchText(matchup) {
  const abbreviation = getOpponentFromMatchup(matchup).toUpperCase();
  const fullName = teamNameMap[abbreviation] || "";
  return `${abbreviation} ${fullName}`.trim().toLowerCase();
}

function getNormalizedResult(game) {
  return String(game.WL ?? game.wl ?? game.result ?? "")
    .trim()
    .toUpperCase();
}

function getNormalizedMatchup(game) {
  return String(game.matchup ?? game.MATCHUP ?? "").trim();
}

function getFirstNumericValue(game, keys) {
  for (const key of keys) {
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

function getGameStatValue(game, stat) {
  const statKeyMap = {
    points: ["points", "PTS", "pts"],
    rebounds: ["rebounds", "REB", "reb"],
    assists: ["assists", "AST", "ast"],
    steals: ["steals", "STL", "stl"],
    blocks: ["blocks", "BLK", "blk"],
    turnovers: ["turnovers", "TOV", "tov"],
    minutes: ["minutes", "MIN", "min"],

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
  return getFirstNumericValue(game, possibleKeys);
}

export function filterGames(
  games,
  locationFilter,
  resultFilter,
  opponentFilter,
  thresholdFilters = [],
) {
  if (!Array.isArray(games)) return [];

  return games.filter((game) => {
    const rawMatchup = getNormalizedMatchup(game);
    const matchup = rawMatchup.toLowerCase();
    const wl = getNormalizedResult(game);

    const isAway = matchup.includes("@");
    const isHome = matchup.includes("vs");

    if (locationFilter === "home" && !isHome) return false;
    if (locationFilter === "away" && !isAway) return false;

    if (resultFilter !== "all" && wl !== resultFilter) return false;

    if (opponentFilter.trim() !== "") {
      const search = opponentFilter.trim().toLowerCase();
      const opponentSearchText = getOpponentSearchText(rawMatchup);

      if (!opponentSearchText.includes(search)) return false;
    }

    for (const filter of thresholdFilters) {
      const value = getGameStatValue(game, filter.stat);

      if (Number.isNaN(value)) {
        return false;
      }

      if (!compareValue(value, filter.operator, filter.value)) {
        return false;
      }
    }

    return true;
  });
}
