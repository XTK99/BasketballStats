const pool = require("../../../../../db/db.js");

/**
 * Inserts an array of team objects into the mlb_teams table in a single query.
 * @param {Array<Object>} teams
 * @returns {Promise<void>}
 */
async function insertTeams(teams) {
  if (!teams.length) return;
  const columns = [
    "id",
    "name",
    "team_name",
    "abbreviation",
    "location_name",
    "short_name",
    "franchise_name",
    "club_name",
    "first_year_of_play",
    "active",
    "league_id",
    "division_id",
    "venue_id",
    "season",
    "team_code",
    "file_code",
  ];
  const values = [];
  const placeholders = teams.map((team, i) => {
    const base = i * columns.length;
    values.push(
      team.id,
      team.name,
      team.team_name,
      team.abbreviation,
      team.location_name,
      team.short_name,
      team.franchise_name,
      team.club_name,
      team.first_year_of_play,
      team.active,
      team.league_id,
      team.division_id,
      team.venue_id,
      team.season,
      team.team_code,
      team.file_code,
    );
    return `(${columns.map((_, j) => `$${base + j + 1}`).join(", ")})`;
  });
  const query = `
    INSERT INTO mlb_teams (
      ${columns.join(", ")}
    ) VALUES
      ${placeholders.join(",\n      ")}
    ON CONFLICT (id) DO NOTHING
  `;
  await pool.query(query, values);
}

module.exports = { insertTeams };
