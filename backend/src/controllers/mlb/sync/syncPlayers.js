// syncPlayers.js
// Sync all MLB players for a given query (e.g., teamId)

const {
  fetchPlayers,
} = require("../../../services/mlb/write/fetchMlbApi/playerApi.js");
const {
  savePlayers,
} = require("../../../services/mlb/write/writeToDb/playerDb.js");

/**
 * Express handler: Sync multiple MLB players (optionally by team or other params)
 */
async function syncPlayers(req, res) {
  const params = req.query.params || "";
  try {
    const players = await fetchPlayers(params);
    if (players && players.length > 0) {
      await savePlayers(players);
      res.json({ ok: true, count: players.length });
    } else {
      res
        .status(500)
        .json({ error: "No players found for the given parameters." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { syncPlayers };
