// getGameIds.js
// Bulk read for MLB game IDs only

const pool = require("../../../../../db/db.js");

/**
 * Get all MLB game IDs from the database.
 * @returns {Promise<Array>} Array of game_id values
 */
async function getGameIds() {
  const result = await pool.query("SELECT game_id FROM mlb_games");
  return result.rows.map((row) => row.game_id);
}

module.exports = { getGameIds };
