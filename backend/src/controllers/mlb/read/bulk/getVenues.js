const {
  getVenues,
} = require("../../../../../services/mlb/read/bulk/getVenues.js");

async function getVenues(req, res) {
  try {
    const venues = await getVenues();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getVenues };
