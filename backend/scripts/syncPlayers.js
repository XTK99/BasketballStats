const axios = require("axios");
const pool = require("../db/db");

function buildFullName(obj) {
  return (
    obj.DISPLAY_FIRST_LAST ||
    obj.DISPLAY_LAST_COMMA_FIRST?.split(",").reverse().join(" ").trim() ||
    [obj.FIRST_NAME, obj.LAST_NAME].filter(Boolean).join(" ").trim() ||
    ""
  );
}

async function fetchCurrentPlayers(season = "2025-26") {
  const url = "https://stats.nba.com/stats/commonallplayers";

  const response = await axios.get(url, {
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
    timeout: 20000,
  });

  const resultSet = response.data?.resultSets?.[0];

  if (!resultSet?.headers || !resultSet?.rowSet) {
    throw new Error("Unexpected NBA response format");
  }

  const headers = resultSet.headers;
  const rows = resultSet.rowSet;

  return rows
    .map((row) => {
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = row[index];
      });

      const fullName = buildFullName(obj).trim();
      const firstName = String(obj.FIRST_NAME || "").trim();
      const lastName = String(obj.LAST_NAME || "").trim();

      return {
        player_id: obj.PERSON_ID,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        team_id: obj.TEAM_ID || null,
        team_abbreviation: obj.TEAM_ABBREVIATION || null,
        team_name: obj.TEAM_NAME || null,
        roster_status: obj.ROSTERSTATUS ?? null,
        season,
      };
    })
    .filter((player) => player.player_id && player.full_name);
}

async function upsertPlayers(players) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const player of players) {
      await client.query(
        `
        INSERT INTO players (
          player_id,
          full_name,
          first_name,
          last_name,
          team_id,
          team_abbreviation,
          team_name,
          roster_status,
          season
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (player_id)
        DO UPDATE SET
          full_name = EXCLUDED.full_name,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          team_id = EXCLUDED.team_id,
          team_abbreviation = EXCLUDED.team_abbreviation,
          team_name = EXCLUDED.team_name,
          roster_status = EXCLUDED.roster_status,
          season = EXCLUDED.season
        `,
        [
          player.player_id,
          player.full_name,
          player.first_name,
          player.last_name,
          player.team_id,
          player.team_abbreviation,
          player.team_name,
          player.roster_status,
          player.season,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  const season = process.argv[2] || "2025-26";

  try {
    console.log(`Fetching players for ${season}...`);
    const players = await fetchCurrentPlayers(season);
    console.log(`Fetched ${players.length} players`);

    await upsertPlayers(players);
    console.log(`Upserted ${players.length} players into players table`);
  } catch (error) {
    console.error("syncPlayers failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
