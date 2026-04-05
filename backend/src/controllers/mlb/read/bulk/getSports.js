const { readService } = require("../../../../services/mlb/read/readService.js");

async function getSports(req, res) {
  try {
    const sports = await readService.getSports();
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getSports };
