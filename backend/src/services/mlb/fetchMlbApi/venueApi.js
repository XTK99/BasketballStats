// venueApi.js
// Fetches MLB venues from the MLB API

const axios = require("axios");
const { MLB_VENUES_ENDPOINT } = require("../mlbEndpoints");

async function fetchVenues() {
  const response = await axios.get(MLB_VENUES_ENDPOINT);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch venues: ${response.status}`);
  }
  return response.data.venues || [];
}

module.exports = { fetchVenues };
