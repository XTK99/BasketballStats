// MLB API Endpoints
const { saveTeams } = require("./writeToDb/teamDb.js");
const { fetchTeams } = require("./fetchMlbApi/teamApi.js");
const { fetchDivisions } = require("./fetchMlbApi/divisionApi.js");
const { saveDivisions } = require("./writeToDb/divisionDb.js");

const downloadService = {
  fetchTeams,
  saveTeams,
  fetchDivisions,
  saveDivisions,
};
module.exports = { downloadService };
// In downloadService, read this endpoint: https://statsapi.mlb.com/api/v1/teams?sportId=1, parse the data into
