function formatPlayerGames(games) {
  return games.map((game) => ({
    gameId: game.Game_ID || game.GAME_ID,
    date: game.GAME_DATE,
    matchup: game.MATCHUP,
    result: game.WL,
    minutes: game.MIN,

    points: game.PTS,
    rebounds: game.REB,
    offensiveRebounds: game.OREB,
    defensiveRebounds: game.DREB,
    assists: game.AST,
    steals: game.STL,
    blocks: game.BLK,
    turnovers: game.TOV,
    fouls: game.PF,

    fieldGoalsMade: game.FGM,
    fieldGoalsAttempted: game.FGA,
    fieldGoalPct: game.FG_PCT,

    threesMade: game.FG3M,
    threesAttempted: game.FG3A,
    threePointPct: game.FG3_PCT,

    freeThrowsMade: game.FTM,
    freeThrowsAttempted: game.FTA,
    freeThrowPct: game.FT_PCT,

    plusMinus: game.PLUS_MINUS,
  }));
}

module.exports = { formatPlayerGames };
