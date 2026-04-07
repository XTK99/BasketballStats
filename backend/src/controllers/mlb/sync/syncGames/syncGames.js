// Re-export downloadAllGamesAllSeasons and syncTeamStatsForGame
module.exports = {
  ...require("./downloadAllGamesAllSeasons.js"),
  ...require("./syncTeamStatsForGame.js"),
};
