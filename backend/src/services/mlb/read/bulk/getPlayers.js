const pool = require("../../../../../db/db.js");

async function getPlayers() {
  const result = await pool.query("SELECT * FROM mlb_players");
  return result.rows;
}

module.exports = { getPlayers };
