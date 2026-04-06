const axios = require("axios");
const { MLB_SCHEDULE_ENDPOINT } = require("../../mlbEndpoints");
const { SPORT_TYPES } = require("../../constants");

/**
 * Fetch all games for all sport IDs and seasons (1975-2026) from the MLB schedule endpoint.
 * @returns {Promise<void>}
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllGames() {
  const sportIds = Object.values(SPORT_TYPES);
  const startYear = 1975;
  const endYear = 2026;
  const allGames = [];
  let delay = 500; // Start with 0.5 seconds

  for (const sportId of sportIds) {
    for (let season = startYear; season <= endYear; season++) {
      const url = `${MLB_SCHEDULE_ENDPOINT}?sportId=${sportId}&season=${season}`;
      let success = false;
      let attempt = 0;
      while (!success) {
        try {
          const response = await axios.get(url);
          // Extract all games for this season
          const games = response.data.dates
            ? response.data.dates.flatMap((date) => date.games || [])
            : [];
          allGames.push(...games);
          console.log(
            `Fetched ${games.length} games for sportId=${sportId}, season=${season}`,
          );
          success = true;
          attempt = 0;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            // Rate limited, exponential backoff
            attempt++;
            delay = delay * 2;
            console.warn(
              `Received 429. Increasing delay to ${delay}ms (attempt ${attempt})`,
            );
            await sleep(delay);
            continue;
          } else {
            console.error(
              `Failed for sportId=${sportId}, season=${season}:`,
              error.message,
            );
            success = true; // Exit loop on non-429 errors
          }
        }
      }
      await sleep(delay);
    }
  }
  return allGames;
}

module.exports = { fetchAllGames };

// Fetch only for sportId=1 and season=2026
//   const sportId = 1;
//   const season = 2026;
//   const url = `${MLB_SCHEDULE_ENDPOINT}?sportId=${sportId}&season=${season}`;
//   try {
//     const response = await axios.get(url);
//     const games = response.data.dates
//       ? response.data.dates.flatMap((date) => date.games || [])
//       : [];
//     allGames.push(...games);
//     console.log(
//       `Fetched ${games.length} games for sportId=${sportId}, season=${season}`,
//     );
//   } catch (error) {
//     console.error(
//       `Failed for sportId=${sportId}, season=${season}:`,
//       error.message,
//     );
//   }
