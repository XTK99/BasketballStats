export function filterGames(
  games,
  locationFilter,
  resultFilter,
  opponentFilter,
  thresholdStat,
  thresholdOperator,
  thresholdValue,
) {
  return games.filter((game) => {
    const matchup = game.matchup || "";
    const result = game.result || "";

    const isHome = matchup.includes("vs.");
    const isAway = matchup.includes("@");

    const matchesLocation =
      locationFilter === "all" ||
      (locationFilter === "home" && isHome) ||
      (locationFilter === "away" && isAway);

    const matchesResult =
      resultFilter === "all" ||
      (resultFilter === "wins" && result === "W") ||
      (resultFilter === "losses" && result === "L");

    const normalizedOpponentFilter = opponentFilter.trim().toLowerCase();

    const matchesOpponent =
      !normalizedOpponentFilter ||
      matchup.toLowerCase().includes(normalizedOpponentFilter);

    const numericThreshold = Number(thresholdValue);
    const hasThreshold =
      thresholdValue !== "" && !Number.isNaN(numericThreshold);

    let matchesThreshold = true;

    if (hasThreshold) {
      const statValue = Number(game[thresholdStat]) || 0;

      if (thresholdOperator === ">=") {
        matchesThreshold = statValue >= numericThreshold;
      } else if (thresholdOperator === "<=") {
        matchesThreshold = statValue <= numericThreshold;
      } else {
        matchesThreshold = statValue === numericThreshold;
      }
    }

    return (
      matchesLocation && matchesResult && matchesOpponent && matchesThreshold
    );
  });
}
