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
const { findPlayerByNameInDB } = require("../services/playerLookupService");
const { searchPlayersInDB } = require("../services/playerSearchService");

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

    console.log("before findPlayerByNameInDB");
    const matchedPlayer = await findPlayerByNameInDB(playerName, season);
    console.log("after findPlayerByNameInDB");
    console.log("matchedPlayer:", matchedPlayer);

    if (!matchedPlayer) {
      return res.status(404).json({
        error: `No player found for "${playerName}"`,
      });
    }

    const playerId = Number(matchedPlayer.player_id);

    if (!Number.isFinite(playerId)) {
      return res.status(500).json({
        error: `Resolved playerId is invalid for "${playerName}"`,
      });
    }

    console.log("before getPlayerGamesFromDBByPlayerId");
    const games = await getPlayerGamesFromDBByPlayerId(playerId, season);
    console.log("after getPlayerGamesFromDBByPlayerId", games?.length);
    const limitedGames = last > 0 ? games.slice(0, last) : games;

    return res.json({
      title: matchedPlayer.full_name,
      source: "database",
      playerId,
      playerName: matchedPlayer.full_name,
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
async function searchPlayersController(req, res) {
  try {
    const query = String(req.query.q || "").trim();
    const season = String(req.query.season || "2025-26").trim();
    const limit = Number(req.query.limit || 10);

    if (!query) {
      return res.json([]);
    }

    const players = await searchPlayersInDB(query, season, limit);

    return res.json(
      players.map((player) => ({
        id: player.player_id,
        name: player.full_name,
        fullName: player.full_name,
        teamId: player.team_id,
        teamAbbreviation: player.team_abbreviation,
        teamName: player.team_name,
      })),
    );
  } catch (error) {
    console.error("Player search controller error:", error);
    console.error(error?.stack);

    return res.status(500).json({
      error: error.message || "Failed to search players",
    });
  }
}
module.exports = {
  healthCheck,
  getTeamGamesController,
  getPlayerGames,
  getBoxScore,
  searchPlayersController,
};
