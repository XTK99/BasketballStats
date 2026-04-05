const {
  getTeams,
} = require("../../../../../services/mlb/read/bulk/getTeams.js");

async function getTeams(req, res) {
  try {
    const teams = await getTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getTeams };
