const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const https = require("https");
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

const NBA_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
  Referer: "https://www.nba.com/",
  Origin: "https://www.nba.com",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Host: "stats.nba.com",
};

const gameScoreCache = new Map();
const httpsAgent = new https.Agent({
  keepAlive: true,
  family: 4,
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function getWithRetry(url, config, label = "request", retries = 4) {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      if (attempt > 1) {
        await sleep(2000 * attempt);
      }

      return await axios.get(url, {
        ...config,
        httpsAgent,
        proxy: false,
      });
    } catch (error) {
      lastError = error;
      const message = error?.message || "Unknown error";
      console.warn(
        `[${label}] attempt ${attempt}/${retries} failed: ${message}`,
      );

      if (attempt < retries) {
        await sleep(3000 * attempt);
      }
    }
  }

  throw lastError;
}

async function fetchGameScores(gameId, teamId, opponentTeamId) {
  const cacheKey = String(gameId);

  if (gameScoreCache.has(cacheKey)) {
    const cached = gameScoreCache.get(cacheKey);
    return {
      teamScore: cached[String(teamId)] ?? null,
      opponentScore: cached[String(opponentTeamId)] ?? null,
    };
  }

  try {
    const response = await getWithRetry(
      "https://stats.nba.com/stats/boxscoretraditionalv2",
      {
        params: {
          GameID: gameId,
          StartPeriod: 0,
          EndPeriod: 14,
          StartRange: 0,
          EndRange: 0,
          RangeType: 0,
        },
        headers: NBA_HEADERS,
        timeout: 20000,
      },
      `boxscore ${gameId}`,
      3,
    );

    const resultSets = response.data?.resultSets || [];

    // Prefer the actual team totals result set by name
    const teamStatsSet =
      resultSets.find((set) => set?.name === "TeamStats") ||
      resultSets.find(
        (set) =>
          Array.isArray(set?.headers) &&
          set.headers.includes("TEAM_ID") &&
          set.headers.includes("PTS") &&
          Array.isArray(set?.rowSet) &&
          set.rowSet.length === 2,
      );

    if (!teamStatsSet?.headers || !teamStatsSet?.rowSet) {
      gameScoreCache.set(cacheKey, {});
      return { teamScore: null, opponentScore: null };
    }

    const teamIdIndex = teamStatsSet.headers.indexOf("TEAM_ID");
    const ptsIndex = teamStatsSet.headers.indexOf("PTS");

    if (teamIdIndex === -1 || ptsIndex === -1) {
      gameScoreCache.set(cacheKey, {});
      return { teamScore: null, opponentScore: null };
    }

    const scoreMap = {};

    for (const row of teamStatsSet.rowSet) {
      const rowTeamId = String(row[teamIdIndex]);
      const rowPts = Number(row[ptsIndex]);

      if (rowTeamId && Number.isFinite(rowPts)) {
        scoreMap[rowTeamId] = rowPts;
      }
    }

    gameScoreCache.set(cacheKey, scoreMap);

    await sleep(150);

    return {
      teamScore: scoreMap[String(teamId)] ?? null,
      opponentScore: scoreMap[String(opponentTeamId)] ?? null,
    };
  } catch (error) {
    console.warn(`Failed to fetch scores for game ${gameId}: ${error.message}`);
    gameScoreCache.set(cacheKey, {});
    return { teamScore: null, opponentScore: null };
  }
}

async function syncPlayer(playerId, season = "2025-26") {
  await sleep(500);

  const response = await getWithRetry(
    "https://stats.nba.com/stats/playergamelog",
    {
      params: {
        PlayerID: playerId,
        Season: season,
        SeasonType: "Regular Season",
        LeagueID: "00",
      },
      headers: NBA_HEADERS,
      timeout: 60000,
    },
    `playergamelog ${playerId}`,
    4,
  );
  const resultSet = response.data?.resultSets?.[0];
  if (!resultSet) {
    throw new Error("No result set returned from NBA API.");
  }

  const headers = resultSet.headers || [];
  const rows = resultSet.rowSet || [];

  console.log(`Syncing ${rows.length} logs for player ${playerId} (${season})`);

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

    if (!gameId || !recordPlayerId) {
      console.log("Skipping row due to missing IDs:", {
        gameId,
        recordPlayerId,
        teamId,
        gameDate,
        matchup,
      });
      continue;
    }

    const { teamScore, opponentScore } = await fetchGameScores(
      gameId,
      teamId,
      opponentTeamId,
    );

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
        season,
        team_score,
        opponent_score
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25
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
        season = EXCLUDED.season,
        team_score = EXCLUDED.team_score,
        opponent_score = EXCLUDED.opponent_score
      `,
      [
        gameId,
        Number(recordPlayerId),
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
        teamScore,
        opponentScore,
      ],
    );
  }

  console.log(`DONE - upserted ${rows.length} rows for player ${playerId}`);
}

module.exports = { syncPlayer, pool };

if (require.main === module) {
  const playerId = Number(process.argv[2] || 1629029);
  const season = process.argv[3] || "2025-26";

  syncPlayer(playerId, season)
    .catch((error) => {
      console.error("Sync failed:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await pool.end();
    });
}
