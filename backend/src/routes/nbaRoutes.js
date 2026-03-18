const express = require("express");
const router = express.Router();
const {
  healthCheck,
  getTeamGamesController,
} = require("../controllers/nbaController");
const { getPlayerGames } = require("../controllers/nbaController");

router.get("/health", healthCheck);
router.get("/team-games", getTeamGamesController);
router.get("/player-games", getPlayerGames);
module.exports = router;
