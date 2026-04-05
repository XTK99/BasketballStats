// mlbController.js
const { syncTeams } = require("./mlb/syncTeams.js");
const { syncDivisions } = require("./mlb/syncDivisions.js");
const { syncLeagues } = require("./mlb/syncLeagues.js");

const mlbController = {
  syncTeams,
  syncDivisions,
  syncLeagues,
};

module.exports = { mlbController };
