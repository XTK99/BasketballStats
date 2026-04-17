const express = require("express");
const cors = require("cors");

const nbaRoutes = require("./src/routes/nbaRoutes");
const kalshiRoutes = require("./src/routes/kalshiRoutes");
const mlbRoutes = require("./src/routes/mlbRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/nba", nbaRoutes);
app.use("/api/kalshi", kalshiRoutes);
if (mlbRoutes) {
  app.use("/api/mlb", mlbRoutes);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
