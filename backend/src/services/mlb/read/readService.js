// readService.js
// Service for reading MLB data from the database

const { getTeams } = require("./bulk/getTeams.js");
const { getDivisions } = require("./bulk/getDivisions.js");
const { getLeagues } = require("./bulk/getLeagues.js");
const { getVenues } = require("./bulk/getVenues.js");
const { getSports } = require("./bulk/getSports.js");
const { getPlayers } = require("./bulk/getPlayers.js");

const readService = {
  getTeams,
  getDivisions,
  getLeagues,
  getVenues,
  getSports,
  getPlayers,
};

module.exports = { readService };
