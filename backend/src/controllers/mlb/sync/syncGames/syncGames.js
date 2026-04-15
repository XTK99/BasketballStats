// Re-export downloadAllGamesAllSeasons, syncTeamStatsForGame, syncTeamStatsForAllGames, and syncGamesThisSeason
module.exports = {
  ...require("./downloadAllGamesAllSeasons.js"),
  ...require("./syncTeamStatsForGame.js"),
  ...require("./syncTeamStatsForAllGames.js"),
  ...require("./syncGamesThisSeason.js"),
};
