// syncVenue.js
// Fetches MLB venues from the API and saves them to the database

const {
  downloadService,
} = require("../../../services/mlb/write/downloadService.js");

async function syncVenues(req, res) {
  try {
    const venues = await downloadService.fetchVenues();
    await downloadService.saveVenues(venues);
    res.status(200).json({
      message: "MLB venues synced successfully",
      count: venues.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { syncVenues };
