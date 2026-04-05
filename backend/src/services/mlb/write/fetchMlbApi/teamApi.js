const { MLB_TEAMS_ENDPOINT } = require("../../mlbEndpoints.js");
const axios = require("axios");

/**
 * Fetches MLB teams from the API and parses them into the Team model shape.
 * @returns {Promise<Array<Object>>} Array of team objects
 */
async function fetchAndParseTeams() {
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
}

module.exports = { fetchAndParseTeams };
