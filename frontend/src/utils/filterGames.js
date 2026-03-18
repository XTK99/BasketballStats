export function filterGames(
  games,
  locationFilter,
  resultFilter,
  opponentFilter,
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

    return matchesLocation && matchesResult && matchesOpponent;
  });
}
