const pool = require("../../../../../db/db.js");

async function getVenues() {
  const result = await pool.query("SELECT * FROM mlb_venues");
  return result.rows;
}

module.exports = { getVenues };
