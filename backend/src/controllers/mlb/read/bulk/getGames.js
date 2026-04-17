// getGames.js
// Controller for getting all MLB games

const { readService } = require("../../../../services/mlb/read/readService.js");

async function getGames(req, res) {
  try {
    console.log("Fetching games...");
    const games = await readService.getGames();
    console.log("GAMES", games.length);
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
}

module.exports = { getGames };
