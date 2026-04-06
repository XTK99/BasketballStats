// leagueApi.js
// Fetches MLB leagues from the MLB API

const axios = require("axios");
// TODO: Replace with the actual endpoint for leagues
const { MLB_LEAGUES_ENDPOINT } = require("../mlbEndpoints");

async function fetchLeagues() {
  const response = await axios.get(MLB_LEAGUES_ENDPOINT);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch leagues: ${response.status}`);
  }
  return response.data.leagues || [];
}

module.exports = { fetchLeagues };
