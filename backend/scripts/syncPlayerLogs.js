const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const axios = require("axios");
const { Pool } = require("pg");

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);

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

function parseGameDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().slice(0, 10);
}

async function syncPlayer(playerId) {
  const response = await axios.get(
    "https://stats.nba.com/stats/playergamelog",
    {
      params: {
        PlayerID: playerId,
        Season: "2025-26",
        SeasonType: "Regular Season",
        LeagueID: "00",
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
    throw new Error("No result set returned from NBA API.");
  }

  const headers = resultSet.headers || [];
  const rows = resultSet.rowSet || [];

  for (const row of rows) {
    const record = Object.fromEntries(
      headers.map((header, index) => [header, row[index]]),
    );

    const gameId = record.Game_ID || record.GAME_ID;
    const recordPlayerId = record.Player_ID || record.PLAYER_ID;
    const gameDateRaw = record.GAME_DATE;
    const teamId = record.Team_ID || record.TEAM_ID;
    const matchup = record.MATCHUP || "";
    const wl = record.WL || "";

    const gameDate = parseGameDate(gameDateRaw);
    const isHome = matchup.includes("vs.");
    const isWin = wl === "W";

    await pool.query(
      `
      INSERT INTO player_game_logs (
        game_id,
        player_id,
        team_id,
        game_date,
        is_home,
        is_win,
        minutes,
        points,
        rebounds,
        assists,
        steals,
        blocks,
        turnovers,
        fgm,
        fga,
        fg3m,
        fg3a,
        ftm,
        fta
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      ON CONFLICT DO NOTHING
      `,
      [
        gameId,
        recordPlayerId,
        teamId || null,
        gameDate,
        isHome,
        isWin,
        Number(record.MIN) || 0,
        Number(record.PTS) || 0,
        Number(record.REB) || 0,
        Number(record.AST) || 0,
        Number(record.STL) || 0,
        Number(record.BLK) || 0,
        Number(record.TOV) || 0,
        Number(record.FGM) || 0,
        Number(record.FGA) || 0,
        Number(record.FG3M) || 0,
        Number(record.FG3A) || 0,
        Number(record.FTM) || 0,
        Number(record.FTA) || 0,
      ],
    );
  }

  console.log(`DONE - inserted ${rows.length} rows for player ${playerId}`);
}

syncPlayer(1629029)
  .catch((error) => {
    console.error("Sync failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
