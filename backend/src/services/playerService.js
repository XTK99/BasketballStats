const fs = require("fs");
const path = require("path");
const axios = require("axios");

const playerCache = new Map();

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/đ/g, "d")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .trim()
    .toLowerCase();
}

function buildFullName(obj) {
  return (
    obj.DISPLAY_FIRST_LAST ||
    obj.DISPLAY_LAST_COMMA_FIRST?.split(",").reverse().join(" ").trim() ||
    [obj.FIRST_NAME, obj.LAST_NAME].filter(Boolean).join(" ").trim() ||
    ""
  );
}

function getLocalPlayersFilePath(season = "2025-26") {
  return path.resolve(__dirname, `../data/players-${season}.json`);
}

function loadPlayersFromLocalFile(season = "2025-26") {
  try {
    const filePath = getLocalPlayersFilePath(season);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to load local players file for ${season}:`, error);
    return [];
  }
}

function savePlayersToLocalFile(season = "2025-26", players = []) {
  try {
    const filePath = getLocalPlayersFilePath(season);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(players, null, 2), "utf8");
  } catch (error) {
    console.error(`Failed to save local players file for ${season}:`, error);
  }
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function getPlayerSearchScore(player, query) {
  const fullName = normalize(player.fullName);
  const queryParts = query.split(/\s+/).filter(Boolean);
  const nameParts = fullName.split(/\s+/).filter(Boolean);

  if (!query) return Infinity;

  if (fullName === query) return 0;
  if (fullName.startsWith(query)) return 1;
  if (fullName.includes(query)) return 2;

  const allPartsMatch = queryParts.every((queryPart) =>
    nameParts.some(
      (namePart) =>
        namePart === queryPart ||
        namePart.startsWith(queryPart) ||
        namePart.includes(queryPart),
    ),
  );

  if (allPartsMatch) return 3;

  const fuzzyPartScore = queryParts.reduce((total, queryPart) => {
    let bestPartDistance = Infinity;

    for (const namePart of nameParts) {
      const distance = levenshteinDistance(namePart, queryPart);
      if (distance < bestPartDistance) {
        bestPartDistance = distance;
      }
    }

    return total + bestPartDistance;
  }, 0);

  if (fuzzyPartScore <= queryParts.length) return 4 + fuzzyPartScore;

  const fullNameDistance = levenshteinDistance(fullName, query);
  return 20 + fullNameDistance;
}

async function fetchCurrentPlayersFromNBA(season = "2025-26") {
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
    timeout: 15000,
  });

  const resultSet = response.data?.resultSets?.[0];

  if (!resultSet?.headers || !resultSet?.rowSet) {
    throw new Error("Unexpected NBA response format");
  }

  const headers = resultSet.headers;
  const rows = resultSet.rowSet;

  const players = rows
    .map((row) => {
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = row[index];
      });

      const fullName = buildFullName(obj);

      return {
        playerId: obj.PERSON_ID,
        fullName,
        teamId: obj.TEAM_ID,
        teamName: obj.TEAM_NAME,
        teamAbbreviation: obj.TEAM_ABBREVIATION,
        rosterStatus: obj.ROSTERSTATUS,
      };
    })
    .filter((player) => player.playerId && player.fullName);

  return players;
}

async function warmPlayerCache(season = "2025-26") {
  const existingPlayers = playerCache.get(season);
  const localPlayers = loadPlayersFromLocalFile(season);

  if (!existingPlayers?.length && localPlayers.length) {
    playerCache.set(season, localPlayers);
    console.log(
      `Loaded player cache from local file for ${season}: ${localPlayers.length} players`,
    );
  }

  try {
    const players = await fetchCurrentPlayersFromNBA(season);
    playerCache.set(season, players);
    savePlayersToLocalFile(season, players);

    console.log(`Warmed player cache for ${season}: ${players.length} players`);
    console.log(
      "Sample players:",
      players.slice(0, 10).map((player) => player.fullName),
    );

    return players;
  } catch (error) {
    console.error(
      `Failed to warm player cache for ${season}:`,
      error?.message || error,
    );

    const cachedPlayers = playerCache.get(season) || [];

    if (cachedPlayers.length) {
      console.log(
        `Using existing player cache for ${season}: ${cachedPlayers.length} players`,
      );
      return cachedPlayers;
    }

    if (localPlayers.length) {
      console.log(
        `Using local players file for ${season}: ${localPlayers.length} players`,
      );
      playerCache.set(season, localPlayers);
      return localPlayers;
    }

    throw error;
  }
}

function searchPlayersLocal(query, season = "2025-26", limit = 10) {
  const players = playerCache.get(season) || loadPlayersFromLocalFile(season);
  const q = normalize(query);

  if (!q) return [];

  const ranked = players
    .map((player) => ({
      player,
      score: getPlayerSearchScore(player, q),
    }))
    .filter(({ score }) => score <= 25)
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.player.fullName.localeCompare(b.player.fullName);
    });

  const seen = new Set();
  const results = [];

  for (const { player } of ranked) {
    const key = `${player.playerId}-${normalize(player.fullName)}`;
    if (seen.has(key)) continue;

    seen.add(key);
    results.push(player);

    if (results.length >= limit) break;
  }

  return results;
}

function findPlayerByName(query, season = "2025-26") {
  const matches = searchPlayersLocal(query, season, 1);
  return matches[0] || null;
}

module.exports = {
  warmPlayerCache,
  searchPlayersLocal,
  findPlayerByName,
};
