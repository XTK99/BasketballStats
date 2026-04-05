// syncSports.js
// Fetches sports from the API and saves them to the database

const {
  downloadService,
} = require("../../services/mlb/write/downloadService.js");

async function syncSports(req, res) {
  try {
    const sports = await downloadService.fetchSports();
    await downloadService.saveSports(sports);
    res.status(200).json({
      message: "Sports synced successfully",
      count: sports.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { syncSports };
