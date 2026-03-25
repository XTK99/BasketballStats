function formatPlayerGamesFromDB(rows) {
  return rows.map((row) => ({
    gameId: row.game_id,
    playerId: row.player_id,
    teamId: row.team_id,
    opponentTeamId: row.opponent_team_id,
    season: row.season,
    gameDate: row.game_date,
    matchup: row.matchup,
    wl: row.wl,
    isHome: row.is_home,
    isWin: row.is_win,
    minutes: Number(row.minutes) || 0,
    points: Number(row.points) || 0,
    rebounds: Number(row.rebounds) || 0,
    assists: Number(row.assists) || 0,
    steals: Number(row.steals) || 0,
    blocks: Number(row.blocks) || 0,
    turnovers: Number(row.turnovers) || 0,
    fgm: Number(row.fgm) || 0,
    fga: Number(row.fga) || 0,
    threesMade: Number(row.fg3m) || 0,
    threesAttempted: Number(row.fg3a) || 0,
    ftm: Number(row.ftm) || 0,
    fta: Number(row.fta) || 0,
  }));
}

module.exports = { formatPlayerGamesFromDB };
