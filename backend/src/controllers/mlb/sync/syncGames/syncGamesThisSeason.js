// syncGamesThisSeason.js
// Controller to sync all MLB games for the current season (year)

const {
  downloadService,
} = require("../../../../services/mlb/write/downloadService.js");

/**
 * Controller to fetch and save all MLB games for the current year.
 * Can be used as an Express route handler.
 */
async function syncGamesThisSeason(req, res) {
  try {
    const games = await downloadService.fetchGamesThisYear();
    await downloadService.saveGames(games);
    res
      .status(200)
      .json({ message: `Synced ${games.length} games for this season.` });
  } catch (error) {
    console.error("Error syncing games for this season:", error);
    res.status(500).json({ error: "Failed to sync games for this season." });
  }
}

module.exports = { syncGamesThisSeason };
