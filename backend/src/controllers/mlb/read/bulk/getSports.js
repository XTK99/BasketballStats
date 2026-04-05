const {
  getSports,
} = require("../../../../../services/mlb/read/bulk/getSports.js");

async function getSports(req, res) {
  try {
    const sports = await getSports();
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getSports };
