const axios = require("axios");
const { MLB_GAME_ENDPOINT } = require("../../mlbEndpoints");

/**
 * Fetch the info payload from the MLB game info endpoint for a given gamePk.
 * @param {number|string} gamePk - The MLB gamePk (game ID)
 * @returns {Promise<Object>} The info payload from the endpoint
 */
async function fetchInfoFromBoxscore(gamePk) {
  if (!gamePk) throw new Error("gamePk is required");
  const url = `${MLB_GAME_ENDPOINT}/${gamePk}/boxscore`;
  console.log(
    `[fetchInfoFromBoxscore] Fetching boxscore info for gamePk: ${gamePk} from URL: ${url}`,
  );
  const response = await axios.get(url);
  return response.data;
}

module.exports = { fetchInfoFromBoxscore };
