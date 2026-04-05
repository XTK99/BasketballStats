const {
  getDivisions,
} = require("../../../../../services/mlb/read/bulk/getDivisions.js");

async function getDivisions(req, res) {
  try {
    const divisions = await getDivisions();
    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getDivisions };
