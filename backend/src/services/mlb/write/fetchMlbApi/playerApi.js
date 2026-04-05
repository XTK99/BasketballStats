// playerApi.js
// Fetches MLB players from the MLB API

const axios = require("axios");
const { MLB_PLAYERS_ENDPOINT } = require("../../mlbEndpoints.js");

async function fetchPlayers(params = "") {
  // params can be a query string like '?teamId=147'
  const url = MLB_PLAYERS_ENDPOINT + params;
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch players: ${response.status}`);
  }
  return response.data.people || [];
}

/**
 * Fetch a single player by id from the MLB API
 * @param {number|string} id - The player id
 * @returns {Promise<Object|null>} The player object or null if not found
 */
async function fetchPlayer(id) {
  const url = `${MLB_PLAYERS_ENDPOINT}/${id}`;
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch player: ${response.status}`);
  }
  const people = response.data.people || [];
  return people.length > 0 ? people[0] : null;
}

module.exports = {
  fetchPlayers,
  fetchPlayer,
};
