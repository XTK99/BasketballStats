const { readService } = require("../../../../services/mlb/read/readService.js");

async function getVenues(req, res) {
  try {
    const venues = await readService.getVenues();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getVenues };
