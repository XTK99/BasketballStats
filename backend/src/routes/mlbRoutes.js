// mlbRoutes.js
const express = require("express");
const { mlbController } = require("../controllers/mlbController.js");

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "mlb" });
});

router.get("/add-player/:id", (req, res, next) => {
  req.query.id = req.params.id;
  mlbController.syncPlayer(req, res, next);
});
router.get("/sync-teams", mlbController.syncTeams);
router.get("/sync-divisions", mlbController.syncDivisions);
router.get("/sync-leagues", mlbController.syncLeagues);
router.get("/sync-venues", mlbController.syncVenues);
router.get("/sync-sports", mlbController.syncSports);

// Sync all games for the current season
router.get("/sync-games", mlbController.syncGamesThisSeason);
router.get("/sync-games/all", mlbController.downloadAllGamesAllSeasons);

// Bulk read routes
router.get("/teams", mlbController.getTeams);
router.get("/divisions", mlbController.getDivisions);
router.get("/leagues", mlbController.getLeagues);
router.get("/venues", mlbController.getVenues);
router.get("/sports", mlbController.getSports);
router.get("/players", mlbController.getPlayers);

module.exports = router;
