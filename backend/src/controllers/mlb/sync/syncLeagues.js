// syncLeagues.js
// Fetches MLB leagues from the API and saves them to the database

const {
  downloadService,
} = require("../../services/mlb/write/downloadService.js");

async function syncLeagues(req, res) {
  try {
    const leagues = await downloadService.fetchLeagues();
    await downloadService.saveLeagues(leagues);
    res.status(200).json({
      message: "MLB leagues synced successfully",
      count: leagues.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { syncLeagues };
