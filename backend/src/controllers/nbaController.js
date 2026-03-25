console.log("LOADED backend/src/controllers/nbaController.js");

const { getTeamIdByName } = require("../services/teamMap");
const {
  getTeamGames,
  limitGames,
  fetchBoxScoreByGameId,
} = require("../services/nbaService");
const { formatTeamGames } = require("../utils/formatTeamGames");
const { calculateTeamAverages } = require("../utils/calculateTeamAverages");
const {
  warmPlayerCache,
  findPlayerByName,
} = require("../services/playerService");
const { getPlayerGamesFromDB } = require("../services/playerGameLogService");

async function getBoxScore(req, res) {
  try {
    const { gameId } = req.params;
    const data = await fetchBoxScoreByGameId(gameId);
    res.json(data);
  } catch (error) {
    console.error("Box score controller error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch box score" });
  }
}

function healthCheck(req, res) {
  res.json({ message: "NBA route working" });
}

async function getTeamGamesController(req, res) {
  try {
    const { teamId, teamName, last = 5, season = "2025-26" } = req.query;

    let resolvedTeamId = teamId ? Number(teamId) : null;
    let resolvedTeamName = teamName || "";

    if (!resolvedTeamId) {
      if (!teamName) {
        return res
          .status(400)
          .json({ error: "teamId or teamName is required" });
      }

      resolvedTeamId = getTeamIdByName(teamName);
      resolvedTeamName = teamName;
    }

    if (!resolvedTeamId) {
      return res.status(400).json({
        error: "Invalid team identifier",
        details: `Could not resolve team: ${teamName || teamId}`,
      });
    }

    const games = await getTeamGames(resolvedTeamId, season);
    const limitedGames = limitGames(games, last);
    const formattedGames = formatTeamGames(limitedGames);
    const averages = calculateTeamAverages(formattedGames);

    res.json({
      teamName: resolvedTeamName,
      teamId: resolvedTeamId,
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
    console.log("USING DB VERSION");

    const playerName = req.query.player;
    const last = Number(req.query.last) || 5;
    const season = req.query.season || "2025-26";

    if (!playerName) {
      return res.status(400).json({ error: "player query is required" });
    }

    await warmPlayerCache(season);

    const matchedPlayer = findPlayerByName(playerName, season);
    console.log("playerName:", playerName);
    console.log("season:", season);
    console.log("matchedPlayer:", matchedPlayer);
    if (!matchedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    const games = await getPlayerGamesFromDB(matchedPlayer.playerId, last);

    return res.json({
      source: "database",
      playerId: matchedPlayer.playerId,
      playerName: matchedPlayer.fullName,
      season,
      count: games.length,
      games,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      error: "Failed to fetch player games",
      details: error.message,
    });
  }
}

module.exports = {
  healthCheck,
  getTeamGamesController,
  getPlayerGames,
  getBoxScore,
};
