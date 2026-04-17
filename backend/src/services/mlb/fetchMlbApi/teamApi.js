const { MLB_TEAMS_ENDPOINT } = require("../mlbEndpoints.js");
const axios = require("axios");

/**
 * Fetches MLB teams from the API and parses them into the Team model shape.
 * @returns {Promise<Array<Object>>} Array of team objects
 */
async function fetchTeams() {
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
    league_name: team.league?.name || null,
    league_link: team.league?.link || null,
    division_id: team.division?.id || null,
    division_name: team.division?.name || null,
    division_link: team.division?.link || null,
    venue_id: team.venue?.id || null,
    venue_name: team.venue?.name || null,
    venue_link: team.venue?.link || null,
    season: team.season,
    team_code: team.teamCode,
    file_code: team.fileCode,
    all_star_status: team.allStarStatus || null,
    link: team.link || null,
    sport_id: team.sport?.id || null,
    sport_name: team.sport?.name || null,
    sport_link: team.sport?.link || null,
    parent_org_name: team.parentOrgName || null,
    parent_org_id: team.parentOrgId || null,
  }));
}

module.exports = { fetchTeams };
