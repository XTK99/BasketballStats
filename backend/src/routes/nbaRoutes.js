const express = require("express");
const router = express.Router();

// ✅ make sure this path is correct
const nbaController = require("../controllers/nbaController");

router.get("/health", nbaController.healthCheck);

router.get("/team-games", nbaController.getTeamGamesController);

// 🔥 DEBUG: confirm route is hit
router.get(
  "/player-games",
  (req, res, next) => {
    console.log("HIT /player-games ROUTE");
    next();
  },
  nbaController.getPlayerGames,
);

router.get("/boxscore/:gameId", nbaController.getBoxScore);

module.exports = router;
///http://localhost:5000/api/nba/player-games?player=LeBron%20James&last=10&season=2025-26///
///http://localhost:5000/api/nba/team-games?teamName=Los%20Angeles%20Lakers&last=10&season=2025-26
