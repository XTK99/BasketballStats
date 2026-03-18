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
      game.opponent?.toLowerCase().includes(opponentFilter.toLowerCase());

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
