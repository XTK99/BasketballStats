// syncVenue.js
// Fetches MLB venues from the API and saves them to the database

const {
  downloadService,
} = require("../../services/mlb/write/downloadService.js");

async function syncVenues() {
  try {
    const venues = await downloadService.fetchVenues();
    await downloadService.saveVenues(venues);
    console.log("Venues synced successfully.");
  } catch (error) {
    console.error("Error syncing venues:", error);
    throw error;
  }
}

module.exports = { syncVenues };
