const { readService } = require("../../../../services/mlb/read/readService.js");

async function getPlayers(req, res) {
  try {
    const players = await readService.getPlayers();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getPlayers };
