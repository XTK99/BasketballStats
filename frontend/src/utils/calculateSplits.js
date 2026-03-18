function averageStat(games, key) {
  if (!games.length) return "0.0";

  const total = games.reduce((sum, game) => {
    return sum + (Number(game[key]) || 0);
  }, 0);

  return (total / games.length).toFixed(1);
}

function buildAverageSet(games) {
  return {
    gameCount: games.length,
    points: averageStat(games, "points"),
    rebounds: averageStat(games, "rebounds"),
    assists: averageStat(games, "assists"),
    steals: averageStat(games, "steals"),
    blocks: averageStat(games, "blocks"),
    turnovers: averageStat(games, "turnovers"),
    minutes: averageStat(games, "minutes"),
  };
}

export function calculateSplits(games = []) {
  const homeGames = games.filter((game) => game.isHome === true);
  const awayGames = games.filter((game) => game.isHome === false);
  const wins = games.filter((game) => game.wl === "W");
  const losses = games.filter((game) => game.wl === "L");

  return {
    home: buildAverageSet(homeGames),
    away: buildAverageSet(awayGames),
    wins: buildAverageSet(wins),
    losses: buildAverageSet(losses),
  };
}
