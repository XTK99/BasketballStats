const { getTeamIdByName } = require("../services/teamMap");
const {
  getTeamGames,
  limitGames,
  fetchPlayerGames,
  fetchBoxScoreByGameId,
} = require("../services/nbaService");
const { formatTeamGames } = require("../utils/formatTeamGames");
const { calculateTeamAverages } = require("../utils/calculateTeamAverages");

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
  getBoxScore,
};
