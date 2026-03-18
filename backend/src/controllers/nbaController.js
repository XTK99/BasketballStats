const { getTeamIdByName } = require("../services/teamMap");
const { getTeamGames, limitGames } = require("../services/nbaService");

function healthCheck(req, res) {
  res.json({ message: "NBA route working" });
}

async function getTeamGamesController(req, res) {
  try {
    const { teamName, last = 5, season = "2025-26" } = req.query;

    if (!teamName) {
      return res.status(400).json({ error: "teamName is required" });
    }

    const teamId = getTeamIdByName(teamName);
    const games = await getTeamGames(teamId, season);
    const limitedGames = limitGames(games, last);

    res.json({
      teamName,
      teamId,
      season,
      count: limitedGames.length,
      games: limitedGames,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  healthCheck,
  getTeamGamesController,
};
