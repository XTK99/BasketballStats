const pool = require("../../db/db");

async function searchPlayersInDB(query, season = "2025-26", limit = 10) {
  const normalized = String(query || "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return [];
  }

  const result = await pool.query(
    `
    SELECT player_id, full_name, team_id, team_abbreviation, team_name
    FROM players
    WHERE season = $1
      AND LOWER(full_name) LIKE $2
    ORDER BY
      CASE
        WHEN LOWER(full_name) = $3 THEN 0
        WHEN LOWER(full_name) LIKE $4 THEN 1
        ELSE 2
      END,
      full_name ASC
    LIMIT $5
    `,
    [season, `%${normalized}%`, normalized, `${normalized}%`, limit],
  );

  return result.rows;
}

module.exports = {
  searchPlayersInDB,
};
