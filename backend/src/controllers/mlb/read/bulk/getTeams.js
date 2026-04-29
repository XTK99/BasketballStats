const { readService } = require("../../../../services/mlb/read/readService.js");

async function getTeams(req, res) {
  try {
    const teams = await readService.getTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getTeams };
