const pool = require("../../../../../db/db.js");

async function getLeagues() {
  const result = await pool.query("SELECT * FROM mlb_leagues");
  return result.rows;
}

module.exports = { getLeagues };
