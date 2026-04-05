// mlbController.js
const { syncTeams } = require("./mlb/syncTeams.js");
const { syncDivisions } = require("./mlb/syncDivisions.js");

const mlbController = {
  syncTeams,
  syncDivisions,
};

module.exports = { mlbController };
