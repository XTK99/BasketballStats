function formatPlayerGames(games) {
  return games.map((game) => ({
    gameId: game.Game_ID || game.GAME_ID,
    date: game.GAME_DATE,
    matchup: game.MATCHUP,
    result: game.WL,
    minutes: game.MIN,
    points: game.PTS,
    rebounds: game.REB,
    assists: game.AST,
    steals: game.STL,
    blocks: game.BLK,
    turnovers: game.TOV,
  }));
}

module.exports = { formatPlayerGames };
