const {
  getPlayers,
} = require("../../../../../services/mlb/read/bulk/getPlayers.js");

async function getPlayers(req, res) {
  try {
    const players = await getPlayers();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getPlayers };
