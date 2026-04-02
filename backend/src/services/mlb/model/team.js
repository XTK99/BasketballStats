// team.js
// Data model for MLB teams, matching the recommended database table structure

/**
 * @typedef {Object} Team
 * @property {number} id - Primary key, team ID
 * @property {string} name - Full team name
 * @property {string} team_name - Short team name
 * @property {string} abbreviation - Team abbreviation
 * @property {string} location_name - City/location
 * @property {string} short_name - Short city name
 * @property {string} franchise_name - Franchise name
 * @property {string} club_name - Club name
 * @property {string} first_year_of_play - Year team started
 * @property {boolean} active - Is the team active
 * @property {number} league_id - League ID
 * @property {number} division_id - Division ID
 * @property {number} venue_id - Venue ID
 * @property {number} season - Current season
 * @property {string} team_code - Team code
 * @property {string} file_code - File code
 */

/**
 * Example Team object
 */
const exampleTeam = {
  id: 0,
  name: "",
  team_name: "",
  abbreviation: "",
  location_name: "",
  short_name: "",
  franchise_name: "",
  club_name: "",
  first_year_of_play: "",
  active: true,
  league_id: 0,
  division_id: 0,
  venue_id: 0,
  season: 0,
  team_code: "",
  file_code: "",
};

module.exports = { exampleTeam };
