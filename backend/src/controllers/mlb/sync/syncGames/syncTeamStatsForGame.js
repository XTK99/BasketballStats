const {
  downloadService,
} = require("../../../../services/mlb/write/downloadService.js");

const { mapTeamStats } = require("../../../../utils/mlb/mapTeamStats.js");

/**
 * Sync team stats for a given gamePk (game ID).
 * Fetches boxscore info and saves team stats for both teams.
 * Express route: GET /sync-team-stats/:gameId
 */
async function syncTeamStatsForGame(req, res) {
  console.log("[syncTeamStatsForGame] Starting sync for game");
  try {
    // Accept both gameId and gameId for compatibility
    const gameId =
      req.params.gameId ||
      req.params.gameId ||
      req.query.gameId ||
      req.query.gameId;
    if (!gameId) {
      return res
        .status(400)
        .json({ error: "Missing required gameId parameter" });
    }
    // Fetch boxscore info
    const info = await downloadService.fetchInfoFromBoxscore(gameId);
    // Helper to map boxscore teamStats to DB schema

    const teamStatsArray = [];
    if (info.teams.home) {
      const mapped = mapTeamStats(info.teams.home, true, gameId);

      if (mapped) teamStatsArray.push(mapped);
    }
    if (info.teams.away) {
      const mapped = mapTeamStats(info.teams.away, false, gameId);
      if (mapped) teamStatsArray.push(mapped);
    }
    if (!teamStatsArray.length) {
      return res
        .status(404)
        .json({ error: "No team stats found in boxscore info" });
    }
    await downloadService.saveTeamStats(teamStatsArray, gameId);
    res
      .status(200)
      .json({ message: "Team stats synced", count: teamStatsArray.length });
  } catch (error) {
    console.error("Error syncing team stats for game:", error);
    res.status(500).json({ error: "Failed to sync team stats for game" });
  }
}

module.exports = { syncTeamStatsForGame };
