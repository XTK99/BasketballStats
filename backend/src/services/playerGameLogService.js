const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

const { Pool } = require("pg");

console.log("PLAYER DB HOST:", process.env.DB_HOST);
console.log("PLAYER DB NAME:", process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: {
    rejectUnauthorized: false,
  },
});

function getSeasonDateRange(season = "2025-26") {
  const [startYearText, endYearText] = String(season).split("-");
  const startYear = Number(startYearText);
  const endYear = Number(`20${endYearText}`);

  if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) {
    return null;
  }

  return {
    startDate: `${startYear}-07-01`,
    endDate: `${endYear}-06-30`,
  };
}

async function getPlayerGamesFromDBByPlayerId(playerId, season = "2025-26") {
  const seasonRange = getSeasonDateRange(season);

  if (!seasonRange) {
    throw new Error(`Invalid season format: ${season}`);
  }

  const query = `
    SELECT *
    FROM player_game_logs
    WHERE player_id = $1
      AND game_date >= $2
      AND game_date <= $3
    ORDER BY game_date DESC
  `;

  const result = await pool.query(query, [
    Number(playerId),
    seasonRange.startDate,
    seasonRange.endDate,
  ]);

  return result.rows;
}

module.exports = {
  getPlayerGamesFromDBByPlayerId,
};
