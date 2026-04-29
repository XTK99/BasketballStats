const pool = require("../../../../../db/db.js");

/**
 * Inserts an array of team objects into the mlb_teams table in a single query.
 * @param {Array<Object>} teams
 * @returns {Promise<void>}
 */
async function saveTeams(teams) {
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
    // New columns
    "all_star_status",
    "link",
    "venue_name",
    "venue_link",
    "league_name",
    "league_link",
    "division_name",
    "division_link",
    "sport_id",
    "sport_name",
    "sport_link",
    "parent_org_name",
    "parent_org_id",
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
      // New columns
      team.all_star_status,
      team.link,
      team.venue_name,
      team.venue_link,
      team.league_name,
      team.league_link,
      team.division_name,
      team.division_link,
      team.sport_id,
      team.sport_name,
      team.sport_link,
      team.parent_org_name,
      team.parent_org_id,
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

module.exports = { saveTeams };
