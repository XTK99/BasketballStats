// MLB API Endpoints
const { saveTeams } = require("./writeToDb/teamDb.js");
const { fetchTeams } = require("./fetchMlbApi/teamApi.js");
const { fetchDivisions } = require("./fetchMlbApi/divisionApi.js");
const { saveDivisions } = require("./writeToDb/divisionDb.js");
const { fetchLeagues } = require("./fetchMlbApi/leagueApi.js");
const { saveLeagues } = require("./writeToDb/leagueDb.js");
const { fetchVenues } = require("./fetchMlbApi/venueApi.js");
const { saveVenues } = require("./writeToDb/venueDb.js");

const downloadService = {
  fetchTeams,
  saveTeams,
  fetchDivisions,
  saveDivisions,
  fetchLeagues,
  saveLeagues,
  fetchVenues,
  saveVenues,
};
module.exports = { downloadService };
// In downloadService, read this endpoint: https://statsapi.mlb.com/api/v1/teams?sportId=1, parse the data into
