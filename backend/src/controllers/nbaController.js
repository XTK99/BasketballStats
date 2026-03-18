const { getTeamIdByName } = require("../services/teamMap");
const { getTeamGames, limitGames } = require("../services/nbaService");
const { fetchPlayerGames } = require("../services/nbaService");
const { formatTeamGames } = require("../utils/formatTeamGames");
const { calculateTeamAverages } = require("../utils/calculateTeamAverages");

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

    const formattedGames = formatTeamGames(limitedGames);
    const averages = calculateTeamAverages(formattedGames);

    res.json({
      teamName,
      teamId,
      season,
      count: formattedGames.length,
      averages,
      games: formattedGames,
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      error: "Failed to fetch team games",
      details: error.message,
    });
  }
}

async function getPlayerGames(req, res) {
  try {
    const playerName = req.query.player;
    const last = Number(req.query.last) || 5;
    const season = req.query.season || "2025-26";

    if (!playerName) {
      return res.status(400).json({ error: "player query is required" });
    }

    const result = await fetchPlayerGames(playerName, last, season);
    res.json(result);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      error: "Failed to fetch player games",
      details: error.message,
    });
  }
}

module.exports = {
  healthCheck,
  getTeamGamesController,
  getPlayerGames,
};
