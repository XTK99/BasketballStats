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

      minutes: matchingPlayerGame ? matchingPlayerGame.minutes : 0,
      points: matchingPlayerGame ? matchingPlayerGame.points : 0,
      rebounds: matchingPlayerGame ? matchingPlayerGame.rebounds : 0,
      assists: matchingPlayerGame ? matchingPlayerGame.assists : 0,
      steals: matchingPlayerGame ? matchingPlayerGame.steals : 0,
      blocks: matchingPlayerGame ? matchingPlayerGame.blocks : 0,
      turnovers: matchingPlayerGame ? matchingPlayerGame.turnovers : 0,

      fgm: matchingPlayerGame ? matchingPlayerGame.fgm : 0,
      fga: matchingPlayerGame ? matchingPlayerGame.fga : 0,
      fgPct: matchingPlayerGame ? matchingPlayerGame.fgPct : 0,

      fg3m: matchingPlayerGame ? matchingPlayerGame.fg3m : 0,
      fg3a: matchingPlayerGame ? matchingPlayerGame.fg3a : 0,
      fg3Pct: matchingPlayerGame ? matchingPlayerGame.fg3Pct : 0,

      ftm: matchingPlayerGame ? matchingPlayerGame.ftm : 0,
      fta: matchingPlayerGame ? matchingPlayerGame.fta : 0,
      ftPct: matchingPlayerGame ? matchingPlayerGame.ftPct : 0,

      wl: matchingPlayerGame ? matchingPlayerGame.wl : teamGame.wl || "",
      teamScore: matchingPlayerGame
        ? matchingPlayerGame.teamScore
        : (teamGame.teamScore ?? null),
      opponentScore: matchingPlayerGame
        ? matchingPlayerGame.opponentScore
        : (teamGame.opponentScore ?? null),
    };
  });
}
