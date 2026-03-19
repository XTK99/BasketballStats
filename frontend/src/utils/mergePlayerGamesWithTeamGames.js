export function mergePlayerGamesWithTeamGames(
  playerGames = [],
  teamGames = [],
) {
  const playerGameMap = new Map(
    playerGames.map((game) => [String(game.gameId), game]),
  );

  return teamGames.map((teamGame, index) => {
    const matchingPlayerGame = playerGameMap.get(String(teamGame.gameId));

    return {
      ...teamGame,
      seasonGameNumber: index + 1,
      played: Boolean(matchingPlayerGame),

      minutes: matchingPlayerGame ? matchingPlayerGame.minutes : null,
      points: matchingPlayerGame ? matchingPlayerGame.points : null,
      rebounds: matchingPlayerGame ? matchingPlayerGame.rebounds : null,
      assists: matchingPlayerGame ? matchingPlayerGame.assists : null,
      steals: matchingPlayerGame ? matchingPlayerGame.steals : null,
      blocks: matchingPlayerGame ? matchingPlayerGame.blocks : null,
      turnovers: matchingPlayerGame ? matchingPlayerGame.turnovers : null,

      fgm: matchingPlayerGame ? matchingPlayerGame.fgm : null,
      fga: matchingPlayerGame ? matchingPlayerGame.fga : null,
      fgPct: matchingPlayerGame ? matchingPlayerGame.fgPct : null,

      fg3m: matchingPlayerGame ? matchingPlayerGame.fg3m : null,
      fg3a: matchingPlayerGame ? matchingPlayerGame.fg3a : null,
      fg3Pct: matchingPlayerGame ? matchingPlayerGame.fg3Pct : null,

      ftm: matchingPlayerGame ? matchingPlayerGame.ftm : null,
      fta: matchingPlayerGame ? matchingPlayerGame.fta : null,
      ftPct: matchingPlayerGame ? matchingPlayerGame.ftPct : null,
    };
  });
}
