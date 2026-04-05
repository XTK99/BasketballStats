const {
  getLeagues,
} = require("../../../../../services/mlb/read/bulk/getLeagues.js");

async function getLeagues(req, res) {
  try {
    const leagues = await getLeagues();
    res.status(200).json(leagues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getLeagues };
