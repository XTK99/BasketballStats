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
  getPlayerGamesFromDBByPlayerId,
} = require("../services/playerGameLogService");
const {
  warmPlayerCache,
  findPlayerByName,
} = require("../services/playerService");

function healthCheck(req, res) {
  return res.json({ message: "NBA route working" });
}

async function getPlayerGames(req, res) {
  try {
    const playerName = String(req.query.player || "").trim();
    const season = req.query.season || "2025-26";
    const last = Number(req.query.last || 10);

    console.log("HIT /player-games ROUTE");
    console.log("USING DB VERSION");
    console.log("playerName:", playerName);
    console.log("season:", season);

    if (!playerName) {
      return res.status(400).json({ error: "Player is required" });
    }

    try {
      await warmPlayerCache(season);
    } catch (error) {
      console.warn(
        "warmPlayerCache failed, continuing with existing cache if available:",
      );
      console.warn(error.message);
    }

    const matchedPlayer = findPlayerByName(playerName);

    console.log("matchedPlayer:", matchedPlayer);

    if (!matchedPlayer) {
      return res.status(404).json({
        error: `No player found for "${playerName}"`,
      });
    }

    const playerId = Number(matchedPlayer.playerId);

    if (!Number.isFinite(playerId)) {
      return res.status(500).json({
        error: `Resolved playerId is invalid for "${playerName}"`,
      });
    }

    const games = await getPlayerGamesFromDBByPlayerId(playerId, season);
    const limitedGames = last > 0 ? games.slice(0, last) : games;

    return res.json({
      title: matchedPlayer.fullName,
      source: "database",
      playerId,
      playerName: matchedPlayer.fullName,
      season,
      count: limitedGames.length,
      totalGames: games.length,
      games: limitedGames,
    });
  } catch (error) {
    console.error("Player games controller error:", error);
    console.error(error?.stack);

    return res.status(500).json({
      error: error.message || "Failed to load player games from database",
    });
  }
}

async function getBoxScore(req, res) {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ error: "gameId is required" });
    }

    const data = await fetchBoxScoreByGameId(gameId);
    return res.json(data);
  } catch (error) {
    console.error("Box score controller error:", error);
    console.error(error?.stack);

    return res.status(500).json({
      error: error.message || "Failed to fetch box score",
    });
  }
}

async function getTeamGamesController(req, res) {
  try {
    const { teamId, teamName, season = "2025-26" } = req.query;
    const last = Number(req.query.last) || 5;

    let resolvedTeamId = teamId ? Number(teamId) : null;
    let resolvedTeamName = teamName ? String(teamName).trim() : "";

    if (!resolvedTeamId) {
      if (!resolvedTeamName) {
        return res.status(400).json({
          error: "teamId or teamName is required",
        });
      }

      resolvedTeamId = getTeamIdByName(resolvedTeamName);
    }

    if (!resolvedTeamId) {
      return res.status(400).json({
        error: "Invalid team identifier",
        details: `Could not resolve team: ${teamName || teamId}`,
      });
    }

    const games = await getTeamGames(resolvedTeamId, season);
    const limitedGames = limitGames(games || [], last);
    const formattedGames = formatTeamGames(limitedGames);
    const averages = calculateTeamAverages(formattedGames);

    return res.json({
      title: resolvedTeamName || "Team Dashboard",
      teamName: resolvedTeamName || null,
      teamId: resolvedTeamId,
      season,
      count: formattedGames.length,
      averages,
      games: formattedGames,
    });
  } catch (error) {
    console.error("Team games controller error:", error);
    console.error(error?.stack);

    return res.status(500).json({
      error: "Failed to fetch team games",
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
