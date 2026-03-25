const axios = require("axios");
const { syncPlayer, pool } = require("./syncPlayerLogs");

async function fetchCurrentPlayers(season = "2025-26") {
  const response = await axios.get(
    "https://stats.nba.com/stats/commonallplayers",
    {
      params: {
        IsOnlyCurrentSeason: 1,
        LeagueID: "00",
        Season: season,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
        Referer: "https://www.nba.com/",
        Origin: "https://www.nba.com",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
      },
      timeout: 30000,
    },
  );

  const resultSet = response.data?.resultSets?.[0];
  if (!resultSet) {
    throw new Error("No result set returned from commonallplayers.");
  }

  const headers = resultSet.headers || [];
  const rows = resultSet.rowSet || [];

  const players = rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  );

  return players
    .filter((player) => {
      const playerId = player.PERSON_ID ?? player.Person_ID;
      const rosterStatus = player.ROSTERSTATUS ?? player.RosterStatus;
      return playerId && Number(rosterStatus) === 1;
    })
    .map((player) => ({
      id: Number(player.PERSON_ID ?? player.Person_ID),
      name: player.DISPLAY_FIRST_LAST ?? player.Display_First_Last ?? "Unknown",
    }));
}

async function run() {
  const season = "2025-26";
  const players = await fetchCurrentPlayers(season);

  console.log(`Found ${players.length} current players`);

  let successCount = 0;
  let failCount = 0;

  for (const player of players) {
    try {
      console.log(`Syncing ${player.name} (${player.id})...`);
      await syncPlayer(player.id, season);
      successCount += 1;
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
