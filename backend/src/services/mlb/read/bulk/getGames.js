// getGames.js
// Bulk read for MLB games

const pool = require("../../../../../db/db.js");

/**
 * Get all MLB games from the database.
 * @returns {Promise<Array>} Array of game records
 */
async function getGames() {
  const result = await pool.query("SELECT * FROM mlb_games");
  return result.rows;
}

module.exports = { getGames };
