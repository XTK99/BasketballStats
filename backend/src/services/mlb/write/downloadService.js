// MLB API Endpoints
const { MLB_TEAMS_ENDPOINT } = require("./../mlbEndpoints.js");
const axios = require("axios");
const { exampleTeam } = require("../model/team.js");
const pool = require("../../../../db/db.js");

// Example structure for future implementation

// Example structure for future implementation

const downloadService = {
  /**
   * Fetches MLB teams from the API and parses them into the Team model shape.
   * @returns {Promise<Array<Object>>} Array of team objects
   */
  async fetchAndParseTeams() {
    const response = await axios.get(MLB_TEAMS_ENDPOINT);
    const teams = response.data?.teams || [];
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      team_name: team.teamName,
      abbreviation: team.abbreviation,
      location_name: team.locationName,
      short_name: team.shortName,
      franchise_name: team.franchiseName,
      club_name: team.clubName,
      first_year_of_play: team.firstYearOfPlay,
      active: team.active,
      league_id: team.league?.id || null,
      division_id: team.division?.id || null,
      venue_id: team.venue?.id || null,
      season: team.season,
      team_code: team.teamCode,
      file_code: team.fileCode,
    }));
  },

  /**
   * Inserts an array of team objects into the mlb_teams table in a single query.
   * @param {Array<Object>} teams
   * @returns {Promise<void>}
   */
  async insertTeams(teams) {
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
        ${placeholders.join(",\n        ")}
      ON CONFLICT (id) DO NOTHING
    `;
    await pool.query(query, values);
  },
};
module.exports = { downloadService };
// In downloadService, read this endpoint: https://statsapi.mlb.com/api/v1/teams?sportId=1, parse the data into
