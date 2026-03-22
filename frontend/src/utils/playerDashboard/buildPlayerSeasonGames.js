export function buildPlayerSeasonGames(teamGames = [], playerGames = []) {
  const playerGameMap = new Map();

  for (const game of playerGames) {
    const gameId = game?.gameId || game?.GAME_ID;
    if (gameId) {
      playerGameMap.set(gameId, game);
    }
  }

  return teamGames.map((teamGame) => {
    const gameId = teamGame?.gameId || teamGame?.GAME_ID;
    const matchingPlayerGame = gameId ? playerGameMap.get(gameId) : null;

    if (matchingPlayerGame) {
      return {
        ...teamGame,
        ...matchingPlayerGame,
        played: true,
      };
    }

    return {
      ...teamGame,
      gameId,
      played: false,
      minutes: 0,
      MIN: 0,
      points: 0,
      PTS: 0,
      rebounds: 0,
      REB: 0,
      assists: 0,
      AST: 0,
      steals: 0,
      STL: 0,
      blocks: 0,
      BLK: 0,
      turnovers: 0,
      TOV: 0,
      threesMade: 0,
      FG3M: 0,
      fg3m: 0,
    };
  });
}
