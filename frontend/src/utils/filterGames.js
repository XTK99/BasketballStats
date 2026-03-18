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

  const parts = matchup.trim().split(/\s+/);
  return parts[2] || "";
}

function getOpponentSearchText(matchup) {
  const abbreviation = getOpponentFromMatchup(matchup).toUpperCase();
  const fullName = teamNameMap[abbreviation] || "";

  return `${abbreviation} ${fullName}`.toLowerCase();
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
    const rawMatchup = (game.matchup || game.MATCHUP || "").trim();
    const matchup = rawMatchup.toLowerCase();
    const wl = String(game.WL || game.wl || game.result || "")
      .trim()
      .toUpperCase();

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
      const value = Number(game[filter.stat]);

      if (Number.isNaN(value)) return false;
      if (!compareValue(value, filter.operator, filter.value)) return false;
    }

    return true;
  });
}
