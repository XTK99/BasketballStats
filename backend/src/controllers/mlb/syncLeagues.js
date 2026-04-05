// syncLeagues.js
// Fetches MLB leagues from the API and saves them to the database

const {
  downloadService,
} = require("../../services/mlb/write/downloadService.js");

async function syncLeagues() {
  try {
    const leagues = await downloadService.fetchLeagues();
    await downloadService.saveLeagues(leagues);
    console.log("Leagues synced successfully.");
  } catch (error) {
    console.error("Error syncing leagues:", error);
    throw error;
  }
}

module.exports = { syncLeagues };
