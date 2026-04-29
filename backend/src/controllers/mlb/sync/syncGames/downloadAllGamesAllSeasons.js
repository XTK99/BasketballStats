// downloadAllGamesAllSeasons.js
// Controller to sync all MLB games from the API into the database
const {
  downloadService,
} = require("../../../../services/mlb/write/downloadService");

async function downloadAllGamesAllSeasons(req, res) {
  try {
    console.log("[syncGames] Fetching all games from MLB API...");
    const games = await downloadService.fetchAllGames();
    console.log(`[syncGames] Fetched ${games ? games.length : 0} games.`);
    if (!games || games.length === 0) {
      console.log("[syncGames] No games found to sync.");
      return res.status(204).json({ message: "No games found to sync." });
    }
    console.log("[syncGames] Inserting games into database...");
    await downloadService.saveGames(games);
    console.log("[syncGames] All games inserted successfully.");
    return res.status(200).json({
      message: "MLB games synced successfully.",
      count: games.length,
    });
  } catch (error) {
    console.error("[syncGames] Error syncing games:", error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { downloadAllGamesAllSeasons };
