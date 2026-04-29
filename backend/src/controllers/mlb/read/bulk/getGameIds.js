// getGameIds.js
// Controller for getting all MLB game IDs

const { readService } = require("../../../../services/mlb/read/readService.js");

async function getGameIds(req, res) {
  try {
    const gameIds = await readService.getGameIds();
    console.log("GAME IDS", gameIds.length);
    res.status(200).json(gameIds);
  } catch (error) {
    console.error("Error fetching game IDs:", error);
    res.status(500).json({ error: "Failed to fetch game IDs" });
  }
}

module.exports = { getGameIds };
