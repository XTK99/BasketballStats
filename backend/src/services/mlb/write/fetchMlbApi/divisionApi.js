// divisionApi.js
// Fetches MLB divisions from the MLB API

const axios = require("axios");
const { MLB_DIVISIONS_ENDPOINT } = require("../../mlbEndpoints");

async function fetchDivisions() {
  const response = await axios.get(MLB_DIVISIONS_ENDPOINT);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch divisions: ${response.status}`);
  }
  const data = response.data;
  return data.divisions || [];
}

module.exports = { fetchDivisions };
