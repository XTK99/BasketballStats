const express = require("express");
const router = express.Router();
const { getMarkets } = require("../controllers/kalshiController");

// GET /api/kalshi/markets
router.get("/markets", getMarkets);

module.exports = router;
