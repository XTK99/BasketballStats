// syncTeams.js
// Controller for syncing MLB teams
const {
  downloadService,
} = require("../../services/mlb/write/downloadService.js");

/**
 * Fetches MLB teams from the API and stores them in the database.
 * @param {Request} req
 * @param {Response} res
 */
async function syncTeams(req, res) {
  try {
    const teams = await downloadService.fetchAndParseTeams();
    await downloadService.insertTeams(teams);
    res.status(200).json({
      message: "MLB teams synced successfully",
      count: teams.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { syncTeams };
