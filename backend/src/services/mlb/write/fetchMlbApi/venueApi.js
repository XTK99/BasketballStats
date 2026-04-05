// venueApi.js
// Fetches MLB venues from the MLB API

const axios = require("axios");
// TODO: Replace with the actual endpoint for venues if different
const MLB_VENUES_ENDPOINT = "https://statsapi.mlb.com/api/v1/venues";

async function fetchVenues() {
  const response = await axios.get(MLB_VENUES_ENDPOINT);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch venues: ${response.status}`);
  }
  return response.data.venues || [];
}

module.exports = { fetchVenues };
