// sportsApi.js
// Fetches sports from the MLB API

const axios = require("axios");
const { MLB_SPORTS_ENDPOINT } = require("../mlbEndpoints");

async function fetchSports() {
  const response = await axios.get(MLB_SPORTS_ENDPOINT);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch sports: ${response.status}`);
  }
  return response.data.sports || [];
}

module.exports = { fetchSports };
