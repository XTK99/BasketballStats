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

  const parts = matchup.trim().split(" ");
  return parts[2] || "";
}

function getOpponentSearchText(matchup) {
  const abbreviation = getOpponentFromMatchup(matchup);
  const fullName = teamNameMap[abbreviation] || "";

  return `${abbreviation} ${fullName}`.toLowerCase();
}

export function filterGames(
  games,
  locationFilter,
  resultFilter,
  opponentFilter,
  thresholdFilters,
) {
  return games.filter((game) => {
    const matchesLocation =
      locationFilter === "all" || game.location === locationFilter;

    const matchesResult =
      resultFilter === "all" ||
      game.result?.toLowerCase() === resultFilter.toLowerCase();

    const matchesOpponent =
      !opponentFilter.trim() ||
      getOpponentSearchText(game.matchup).includes(
        opponentFilter.trim().toLowerCase(),
      );

    const matchesThresholds =
      thresholdFilters.length === 0 ||
      thresholdFilters.every((filter) => {
        const gameValue = Number(game[filter.stat]);
        if (Number.isNaN(gameValue)) return false;
        return compareValue(gameValue, filter.operator, filter.value);
      });

    return (
      matchesLocation && matchesResult && matchesOpponent && matchesThresholds
    );
  });
}
