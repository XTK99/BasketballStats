// mlbController.js

const { syncTeams } = require("./mlb/sync/syncTeams.js");
const { syncDivisions } = require("./mlb/sync/syncDivisions.js");
const { syncLeagues } = require("./mlb/sync/syncLeagues.js");
const { syncVenues } = require("./mlb/sync/syncVenues.js");
const { syncSports } = require("./mlb/sync/syncSports.js");

const { getTeams } = require("./mlb/read/bulk/getTeams.js");
const { getDivisions } = require("./mlb/read/bulk/getDivisions.js");
const { getLeagues } = require("./mlb/read/bulk/getLeagues.js");
const { getVenues } = require("./mlb/read/bulk/getVenues.js");
const { getSports } = require("./mlb/read/bulk/getSports.js");
const { getPlayers } = require("./mlb/read/bulk/getPlayers.js");

const mlbController = {
  syncTeams,
  syncDivisions,
  syncLeagues,
  syncVenues,
  syncSports,

  getTeams,
  getDivisions,
  getLeagues,
  getVenues,
  getSports,
  getPlayers,
};

module.exports = { mlbController };
