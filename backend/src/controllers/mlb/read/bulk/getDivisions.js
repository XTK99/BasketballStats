const { readService } = require("../../../../services/mlb/read/readService.js");

async function getDivisions(req, res) {
  try {
    const divisions = await readService.getDivisions();
    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getDivisions };
