// mlbController.js
const { syncTeams } = require("./mlb/syncTeams.js");
const { syncDivisions } = require("./mlb/syncDivisions.js");
const { syncLeagues } = require("./mlb/syncLeagues.js");
const { syncVenues } = require("./mlb/syncVenues.js");

const mlbController = {
  syncTeams,
  syncDivisions,
  syncLeagues,
  syncVenues,
};

module.exports = { mlbController };
