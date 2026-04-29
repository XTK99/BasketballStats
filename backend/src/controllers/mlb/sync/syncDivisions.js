// syncDivisions.js
// Controller for syncing MLB divisions
const {
  downloadService,
} = require("../../../services/mlb/write/downloadService.js");

/**
 * Fetches MLB divisions from the API and stores them in the database.
 * @param {Request} req
 * @param {Response} res
 */
async function syncDivisions(req, res) {
  try {
    const divisions = await downloadService.fetchDivisions();
    await downloadService.saveDivisions(divisions);
    res.status(200).json({
      message: "MLB divisions synced successfully",
      count: divisions.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { syncDivisions };
