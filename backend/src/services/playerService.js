const axios = require("axios");

const playerCache = new Map();

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
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
    },
    timeout: 10000,
  });

  const resultSet = response.data?.resultSets?.[0];

  if (!resultSet?.headers || !resultSet?.rowSet) {
    throw new Error("Unexpected NBA response format");
  }

  const headers = resultSet.headers;
  const rows = resultSet.rowSet;

  return rows.map((row) => {
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    return {
      playerId: obj.PERSON_ID,
      fullName: obj.DISPLAY_FIRST_LAST,
      teamId: obj.TEAM_ID,
      teamName: obj.TEAM_NAME,
      teamAbbreviation: obj.TEAM_ABBREVIATION,
    };
  });
}

async function warmPlayerCache(season = "2025-26") {
  if (playerCache.has(season)) {
    return playerCache.get(season);
  }

  const players = await fetchCurrentPlayersFromNBA(season);
  playerCache.set(season, players);
  return players;
}

function searchPlayersLocal(query, season = "2025-26", limit = 10) {
  const players = playerCache.get(season) || [];
  const q = normalize(query);

  if (!q) return [];

  const startsWith = [];
  const includes = [];

  for (const player of players) {
    const name = normalize(player.fullName);

    if (name.startsWith(q)) {
      startsWith.push(player);
    } else if (name.includes(q)) {
      includes.push(player);
    }
  }

  return [...startsWith, ...includes].slice(0, limit);
}

module.exports = {
  warmPlayerCache,
  searchPlayersLocal,
};
