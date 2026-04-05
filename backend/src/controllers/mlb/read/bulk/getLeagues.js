const { readService } = require("../../../../services/mlb/read/readService.js");

async function getLeagues(req, res) {
  try {
    const leagues = await readService.getLeagues();
    res.status(200).json(leagues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getLeagues };
