// mlbController.js
const { downloadService } = require("../services/mlb/write/downloadService.js");

const mlbController = {
  /**
   * Fetches MLB teams from the API and stores them in the database.
   * @param {Request} req
   * @param {Response} res
   */
  async syncTeams(req, res) {
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
  },
};

module.exports = { mlbController };
