// mlbRoutes.js
const express = require("express");
const { mlbController } = require("../controllers/mlbController.js");

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "mlb" });
});

router.get("/sync-teams", mlbController.syncTeams);
router.get("/sync-divisions", mlbController.syncDivisions);
router.get("/sync-leagues", mlbController.syncLeagues);

module.exports = router;
