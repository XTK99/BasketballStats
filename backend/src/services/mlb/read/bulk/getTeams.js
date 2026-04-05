const pool = require("../../../../db/db.js");

async function getTeams() {
  const result = await pool.query("SELECT * FROM mlb_teams");
  return result.rows;
}

module.exports = { getTeams };
