const pool = require("../../../../../db/db.js");

async function getSports() {
  const result = await pool.query("SELECT * FROM mlb_sports");
  return result.rows;
}

module.exports = { getSports };
