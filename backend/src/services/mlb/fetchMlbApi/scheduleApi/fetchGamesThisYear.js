const axios = require("axios");
const { MLB_SCHEDULE_ENDPOINT } = require("../../mlbEndpoints");
const { SPORT_TYPES } = require("../../constants");

/**
 * Fetch all games for all sport IDs for the current year from the MLB schedule endpoint.
 * @returns {Promise<Array>} Array of game objects
 */
async function fetchGamesThisYear() {
  const sportIds = Object.values(SPORT_TYPES);
  const year = new Date().getFullYear();
  const allGames = [];
  let delay = 500;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  for (const sportId of sportIds) {
    const url = `${MLB_SCHEDULE_ENDPOINT}?sportId=${sportId}&season=${year}`;
    let success = false;
    let attempt = 0;
    while (!success) {
      try {
        const response = await axios.get(url);
        const games = response.data.dates
          ? response.data.dates.flatMap((date) => date.games || [])
          : [];
        allGames.push(...games);
        console.log(
          `Fetched ${games.length} games for sportId=${sportId}, season=${year}`,
        );
        success = true;
        attempt = 0;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          attempt++;
          delay = delay * 2;
          console.warn(
            `Received 429. Increasing delay to ${delay}ms (attempt ${attempt})`,
          );
          await sleep(delay);
          continue;
        } else {
          console.error(
            `Failed for sportId=${sportId}, season=${year}:`,
            error.message,
          );
          success = true;
        }
      }
    }
    await sleep(delay);
  }
  return allGames;
}

module.exports = { fetchGamesThisYear };
