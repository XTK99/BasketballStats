const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const axios = require("axios");
const { Pool } = require("pg");

const {
  getTeamIdByAbbreviation,
  getOpponentAbbreviationFromMatchup,
} = require("../src/services/teamMap");

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

function getRecordValue(record, ...keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }
  return null;
}

function getTeamAbbreviationFromMatchup(matchup) {
  const text = String(matchup || "").trim();
  if (!text) return null;

  const parts = text.split(" ");
  return parts[0] || null;
}

async function syncPlayer(playerId, season = "2025-26") {
  const response = await axios.get(
    "https://stats.nba.com/stats/playergamelog",
    {
      params: {
        PlayerID: playerId,
        Season: season,
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

  console.log("NBA headers:", headers);

  for (const row of rows) {
    const record = Object.fromEntries(
      headers.map((header, index) => [header, row[index]]),
    );

    const gameId = getRecordValue(record, "GAME_ID", "Game_ID");
    const recordPlayerId = getRecordValue(record, "PLAYER_ID", "Player_ID");

    const gameDateRaw = getRecordValue(record, "GAME_DATE", "Game_Date");
    const gameDate = parseGameDate(gameDateRaw);

    const matchup = getRecordValue(record, "MATCHUP", "Matchup") || "";
    const wl = getRecordValue(record, "WL", "W/L") || "";

    const rawTeamId = getRecordValue(record, "TEAM_ID", "Team_ID");
    const teamAbbrFromMatchup = getTeamAbbreviationFromMatchup(matchup);

    const teamId =
      rawTeamId != null
        ? Number(rawTeamId)
        : teamAbbrFromMatchup
          ? getTeamIdByAbbreviation(teamAbbrFromMatchup)
          : null;

    const isHome = matchup.includes("vs.");
    const isWin = wl === "W";

    const opponentAbbr = getOpponentAbbreviationFromMatchup(matchup);
    const opponentTeamId = opponentAbbr
      ? getTeamIdByAbbreviation(opponentAbbr)
      : null;

    console.log({
      gameId,
      recordPlayerId,
      rawTeamId,
      teamAbbrFromMatchup,
      teamId,
      opponentAbbr,
      opponentTeamId,
      gameDate,
      matchup,
    });

    if (!gameId || !recordPlayerId) {
      console.log("Skipping row due to missing IDs:", {
        availableKeys: Object.keys(record),
        gameId,
        recordPlayerId,
        teamId,
        gameDate,
        matchup,
      });
      continue;
    }

    await pool.query(
      `
      INSERT INTO player_game_logs (
        game_id,
        player_id,
        team_id,
        opponent_team_id,
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
        fta,
        wl,
        matchup,
        season
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23
      )
      ON CONFLICT (player_id, game_id)
      DO UPDATE SET
        team_id = EXCLUDED.team_id,
        opponent_team_id = EXCLUDED.opponent_team_id,
        game_date = EXCLUDED.game_date,
        is_home = EXCLUDED.is_home,
        is_win = EXCLUDED.is_win,
        minutes = EXCLUDED.minutes,
        points = EXCLUDED.points,
        rebounds = EXCLUDED.rebounds,
        assists = EXCLUDED.assists,
        steals = EXCLUDED.steals,
        blocks = EXCLUDED.blocks,
        turnovers = EXCLUDED.turnovers,
        fgm = EXCLUDED.fgm,
        fga = EXCLUDED.fga,
        fg3m = EXCLUDED.fg3m,
        fg3a = EXCLUDED.fg3a,
        ftm = EXCLUDED.ftm,
        fta = EXCLUDED.fta,
        wl = EXCLUDED.wl,
        matchup = EXCLUDED.matchup,
        season = EXCLUDED.season
      `,
      [
        gameId,
        recordPlayerId,
        teamId,
        opponentTeamId,
        gameDate,
        isHome,
        isWin,
        Number(getRecordValue(record, "MIN")) || 0,
        Number(getRecordValue(record, "PTS")) || 0,
        Number(getRecordValue(record, "REB")) || 0,
        Number(getRecordValue(record, "AST")) || 0,
        Number(getRecordValue(record, "STL")) || 0,
        Number(getRecordValue(record, "BLK")) || 0,
        Number(getRecordValue(record, "TOV")) || 0,
        Number(getRecordValue(record, "FGM")) || 0,
        Number(getRecordValue(record, "FGA")) || 0,
        Number(getRecordValue(record, "FG3M")) || 0,
        Number(getRecordValue(record, "FG3A")) || 0,
        Number(getRecordValue(record, "FTM")) || 0,
        Number(getRecordValue(record, "FTA")) || 0,
        wl,
        matchup,
        season,
      ],
    );
  }

  console.log(`DONE - upserted ${rows.length} rows for player ${playerId}`);
}

module.exports = { syncPlayer, pool };

if (require.main === module) {
  syncPlayer(1629029)
    .catch((error) => {
      console.error("Sync failed:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await pool.end();
    });
}
