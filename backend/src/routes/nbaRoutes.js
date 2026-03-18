const express = require("express");
const router = express.Router();

const {
  healthCheck,
  getTeamGamesController,
  getPlayerGames,
  getBoxScore,
} = require("../controllers/nbaController");

router.get("/health", healthCheck);
router.get("/team-games", getTeamGamesController);
router.get("/player-games", getPlayerGames);
router.get("/boxscore/:gameId", getBoxScore);

module.exports = router;

///http://localhost:5000/api/nba/player-games?player=LeBron%20James&last=10&season=2025-26///
///http://localhost:5000/api/nba/team-games?teamName=Los%20Angeles%20Lakers&last=10&season=2025-26
