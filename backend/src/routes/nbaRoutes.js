const express = require("express");
const router = express.Router();
const {
  healthCheck,
  getTeamGamesController,
} = require("../controllers/nbaController");

router.get("/health", healthCheck);
router.get("/team-games", getTeamGamesController);

module.exports = router;
