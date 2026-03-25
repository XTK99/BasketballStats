const pool = require("../../db/db");

async function getPlayerGamesFromDB(playerId, last = 10) {
  const result = await pool.query(
    `
    SELECT *
    FROM player_game_logs
    WHERE player_id = $1
    ORDER BY game_date DESC
    LIMIT $2
    `,
    [playerId, last],
  );

  return result.rows;
}

module.exports = {
  getPlayerGamesFromDB,
};
