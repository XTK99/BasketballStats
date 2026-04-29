const {
  downloadService,
} = require("../../../../services/mlb/write/downloadService.js");
const { readService } = require("../../../../services/mlb/read/readService.js");
const { mapTeamStats } = require("../../../../utils/mlb/mapTeamStats.js");

// Controller to sync all team stats for all games using bulkSaveTeamStatsDb
async function syncTeamStatsForAllGames(req, res) {
  console.log("[syncTeamStatsForAllGames] Starting sync for all games");
  try {
    console.log("[syncTeamStatsForAllGames] Starting sync for all games");
    let gameIds = await readService.getGameIds();
    // Filter out gameIds less than 34536
    // gameIds = gameIds.filter((id) => Number(id) >= 34536);
    console.log(
      `[syncTeamStatsForAllGames] Retrieved ${gameIds.length} game IDs (filtered to >= 34536)`,
    );
    let successCount = 0;
    let failureCount = 0;
    for (let i = 0; i < gameIds.length; i++) {
      const gameId = gameIds[i];

      console.log(
        `[syncTeamStatsForAllGames] Processing game ${i + 1} / ${gameIds.length} (gameId: ${gameId})`,
      );

      try {
        const info = await downloadService.fetchInfoFromBoxscore(gameId);
        const arr = [];
        if (info.teams?.home) {
          const mapped = mapTeamStats(info.teams.home, true, gameId);
          if (mapped) arr.push(mapped);
        }
        if (info.teams?.away) {
          const mapped = mapTeamStats(info.teams.away, false, gameId);
          if (mapped) arr.push(mapped);
        }
        if (arr.length) {
          // Save this game's team stats to the DB immediately
          const singleGameStatsMap = { [gameId]: arr };
          await downloadService.bulkSaveTeamStatsDb(singleGameStatsMap);
          successCount++;
          console.log(
            `[syncTeamStatsForAllGames] Saved team stats for gameId ${gameId}`,
          );
          console.log(
            `[syncTeamStatsForAllGames] Successes: ${successCount}, Failures: ${failureCount}`,
          );
        } else {
          failureCount++;
          console.log(
            `[syncTeamStatsForAllGames] Successes: ${successCount}, Failures: ${failureCount}`,
          );
        }
      } catch (err) {
        console.error(
          `[syncTeamStatsForAllGames] Failed to fetch boxscore for gameId ${gameId}:`,
          err.message,
        );
        failureCount++;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log(
      `[syncTeamStatsForAllGames] Finished processing and saving all team stats.`,
    );
    console.log(
      `[syncTeamStatsForAllGames] Successes: ${successCount}, Failures: ${failureCount}`,
    );
    res.status(200).json({ message: "All team stats synced for all games." });
  } catch (error) {
    console.error(
      "[syncTeamStatsForAllGames] Error syncing all team stats for all games:",
      error,
    );
    res
      .status(500)
      .json({ error: "Failed to sync all team stats for all games" });
  }
}

module.exports = { syncTeamStatsForAllGames };
