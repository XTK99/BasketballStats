const express = require("express");
const cors = require("cors");
const nbaRoutes = require("./src/routes/nbaRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/nba", nbaRoutes);

app.get("/", (req, res) => {
  res.send("NBA backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
