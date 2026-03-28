const express = require("express");
const router = express.Router();

const nbaController = require("../controllers/nbaController");

// Health check
router.get("/health", nbaController.healthCheck);

// Player search (NEW)
router.get("/player-search", nbaController.searchPlayersController);

// Player games
router.get(
  "/player-games",
  (req, res, next) => {
    console.log("HIT /player-games ROUTE");
    next();
  },
  nbaController.getPlayerGames,
);

// Team games
router.get("/team-games", nbaController.getTeamGamesController);

// Box score
router.get("/boxscore/:gameId", nbaController.getBoxScore);

module.exports = router;
