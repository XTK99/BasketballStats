// mlbRoutes.js
const express = require("express");
const { mlbController } = require("../controllers/mlbController.js");

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "mlb" });
});

// Route to sync MLB teams
// router.get("/sync-teams", mlbController.syncTeams);

module.exports = router;
