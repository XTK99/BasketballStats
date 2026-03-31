const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = require("pg");
const { syncPlayer } = require("./syncPlayerLogs");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: {
    rejectUnauthorized: false,
  },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPlayersFromDB(season = "2025-26") {
  const result = await pool.query(
    `
    SELECT player_id, full_name
    FROM players
    WHERE season = $1
      AND COALESCE(roster_status, 0) = 1
    ORDER BY full_name ASC
    `,
    [season],
  );

  return result.rows.map((row) => ({
    id: Number(row.player_id),
    name: row.full_name || "Unknown",
  }));
}

async function run() {
  const season = process.argv[2] || "2025-26";
  const players = await fetchPlayersFromDB(season);

  console.log(`Found ${players.length} players in DB for ${season}`);

  let successCount = 0;
  let failCount = 0;

  for (const player of players) {
    try {
      console.log(`Syncing ${player.name} (${player.id})...`);
      await syncPlayer(player.id, season);
      successCount += 1;

      await sleep(500);
    } catch (error) {
      failCount += 1;
      console.error(`Failed for ${player.name} (${player.id}):`, error.message);
    }
  }

  console.log("Full sync complete");
  console.log({ successCount, failCount, total: players.length });
}

run()
  .catch((error) => {
    console.error("syncAllPlayers failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
