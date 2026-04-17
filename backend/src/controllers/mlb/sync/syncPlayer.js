// syncPlayer.js
// Sync a single MLB player by id

const {
  fetchPlayer,
  savePlayer,
} = require("../../../services/mlb/write/downloadService.js");

/**
 * Express handler: Sync a single MLB player by id from req.params.id
 */
async function syncPlayer(req, res) {
  const id = req.params.id;
  try {
    const player = await fetchPlayer(id);
    if (player) {
      await savePlayer(player);
      res.json({ ok: true, id });
    } else {
      res.status(500).json({ error: `Player with id ${id} not found.` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { syncPlayer };
