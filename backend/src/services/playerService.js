const axios = require("axios");

const playerCache = new Map();

function normalize(value) {
  return String(value || "")
    .normalize("NFD") // break accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
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
  if (playerCache.has(season)) {
    return playerCache.get(season);
  }

  const players = await fetchCurrentPlayersFromNBA(season);
  playerCache.set(season, players);

  console.log(`Warmed player cache for ${season}: ${players.length} players`);
  console.log(
    "Sample players:",
    players.slice(0, 10).map((player) => player.fullName),
  );

  return players;
}

function searchPlayersLocal(query, season = "2025-26", limit = 10) {
  const players = playerCache.get(season) || [];
  const q = normalize(query);

  if (!q) return [];

  const exact = [];
  const startsWith = [];
  const includes = [];

  for (const player of players) {
    const name = normalize(player.fullName);

    if (name === q) {
      exact.push(player);
    } else if (name.startsWith(q)) {
      startsWith.push(player);
    } else if (name.includes(q)) {
      includes.push(player);
    }
  }

  return [...exact, ...startsWith, ...includes].slice(0, limit);
}

function findPlayerByName(query, season = "2025-26") {
  const players = playerCache.get(season) || [];
  const q = normalize(query);

  if (!q) return null;

  return (
    players.find((player) => normalize(player.fullName) === q) ||
    players.find((player) => normalize(player.fullName).startsWith(q)) ||
    players.find((player) => normalize(player.fullName).includes(q)) ||
    null
  );
}

module.exports = {
  warmPlayerCache,
  searchPlayersLocal,
  findPlayerByName,
};
