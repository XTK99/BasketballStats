const pool = require("../../db/db");

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

async function findPlayerByNameInDB(query, season = "2025-26") {
  const search = `%${normalize(query)}%`;

  const result = await pool.query(
    `
    SELECT player_id, full_name, team_id, team_abbreviation, team_name
    FROM players
    WHERE LOWER(full_name) LIKE $1
      AND season = $2
    ORDER BY
      CASE
        WHEN LOWER(full_name) = LOWER($3) THEN 0
        WHEN LOWER(full_name) LIKE LOWER($4) THEN 1
        ELSE 2
      END,
      full_name ASC
    LIMIT 1
    `,
    [search, season, query, `${normalize(query)}%`],
  );

  return result.rows[0] || null;
}

module.exports = {
  findPlayerByNameInDB,
};
