const { NBA_HEADERS } = require("../utils/nbaHeaders");
const { formatPlayerGames } = require("../utils/formatPlayerGames");
const { calculateAverages } = require("../utils/calculateAverages");

async function getTeamGames(teamId, season = "2025-26") {
  const url =
    "https://stats.nba.com/stats/teamgamelog" +
    `?TeamID=${teamId}` +
    `&Season=${season}` +
    "&SeasonType=Regular+Season" +
    "&LeagueID=00";

  const response = await fetch(url, {
    headers: NBA_HEADERS,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("NBA API error:", text);
    throw new Error(`Failed to fetch team games: ${response.status}`);
  }

  const data = await response.json();
  const resultSet = data.resultSets?.[0];

  if (!resultSet) {
    throw new Error("No result set returned from NBA API");
  }

  const rows = resultSet.rowSet || [];
  const headers = resultSet.headers || [];

  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  );
}

function limitGames(games, last = 5) {
  return games.slice(0, Number(last));
}

function normalizeName(name = "") {
  return String(name)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function reverseName(name = "") {
  const parts = normalizeName(name).split(" ").filter(Boolean);
  if (parts.length < 2) return normalizeName(name);

  const first = parts[0];
  const rest = parts.slice(1).join(" ");
  return `${rest} ${first}`.trim();
}

async function findPlayerByName(playerName, season = "2025-26") {
  const url =
    "https://stats.nba.com/stats/leaguedashplayerstats" +
    `?College=` +
    `&Conference=` +
    `&Country=` +
    `&DateFrom=` +
    `&DateTo=` +
    `&Division=` +
    `&DraftPick=` +
    `&DraftYear=` +
    `&GameScope=` +
    `&GameSegment=` +
    `&Height=` +
    `&LastNGames=0` +
    `&LeagueID=00` +
    `&Location=` +
    `&MeasureType=Base` +
    `&Month=0` +
    `&OpponentTeamID=0` +
    `&Outcome=` +
    `&PORound=0` +
    `&PaceAdjust=N` +
    `&PerMode=PerGame` +
    `&Period=0` +
    `&PlayerExperience=` +
    `&PlayerPosition=` +
    `&PlusMinus=N` +
    `&Rank=N` +
    `&Season=${season}` +
    `&SeasonSegment=` +
    `&SeasonType=Regular+Season` +
    `&ShotClockRange=` +
    `&StarterBench=` +
    `&TeamID=0` +
    `&TwoWay=0` +
    `&VsConference=` +
    `&VsDivision=`;

  const response = await fetch(url, {
    headers: NBA_HEADERS,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("NBA API error:", text);
    throw new Error(`Failed to fetch players list: ${response.status}`);
  }

  const data = await response.json();
  const resultSet = data.resultSets?.[0];

  if (!resultSet) {
    throw new Error("No player result set returned from NBA API");
  }

  const headers = resultSet.headers || [];
  const rows = resultSet.rowSet || [];

  const players = rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  );

  const normalizedSearch = normalizeName(playerName);
  const reversedSearch = reverseName(playerName);

  function getNames(player) {
    return [player.PLAYER_NAME].filter(Boolean).map(normalizeName);
  }

  const exactMatch = players.find((player) => {
    const names = getNames(player);
    return names.includes(normalizedSearch);
  });

  if (exactMatch) return exactMatch;

  const reversedExactMatch = players.find((player) => {
    const names = getNames(player);
    return names.includes(reversedSearch);
  });

  if (reversedExactMatch) return reversedExactMatch;

  const partialMatch = players.find((player) => {
    const names = getNames(player);
    return names.some(
      (name) =>
        name.includes(normalizedSearch) || normalizedSearch.includes(name),
    );
  });

  if (partialMatch) return partialMatch;

  const searchParts = normalizedSearch.split(" ").filter(Boolean);

  const looseMatch = players.find((player) => {
    const names = getNames(player);
    return searchParts.every((part) =>
      names.some((name) => name.includes(part)),
    );
  });

  if (looseMatch) return looseMatch;

  const possibleMatches = players
    .filter((player) => {
      const names = getNames(player);
      return searchParts.some((part) =>
        names.some((name) => name.includes(part)),
      );
    })
    .slice(0, 10)
    .map((player) => ({
      PLAYER_ID: player.PLAYER_ID,
      PLAYER_NAME: player.PLAYER_NAME,
    }));

  console.log("Player search failed for:", playerName);
  console.log("Normalized search:", normalizedSearch);
  console.log("Possible matches:", possibleMatches);

  throw new Error(`Player not found: ${playerName}`);
}

async function fetchPlayerGames(playerName, last = 5, season = "2025-26") {
  const player = await findPlayerByName(playerName, season);

  const url =
    "https://stats.nba.com/stats/playergamelog" +
    `?PlayerID=${player.PLAYER_ID}` +
    `&Season=${season}` +
    "&SeasonType=Regular+Season" +
    "&LeagueID=00";

  const response = await fetch(url, {
    headers: NBA_HEADERS,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("NBA API error:", text);
    throw new Error(`Failed to fetch player games: ${response.status}`);
  }

  const data = await response.json();
  const resultSet = data.resultSets?.[0];

  if (!resultSet) {
    throw new Error("No player game log returned from NBA API");
  }

  const headers = resultSet.headers || [];
  const rows = resultSet.rowSet || [];

  const rawGames = rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  );

  const limitedGames = rawGames.slice(0, Number(last));
  const formattedGames = formatPlayerGames(limitedGames);
  const averages = calculateAverages(formattedGames);

  return {
    player: player.PLAYER_NAME,
    playerId: player.PLAYER_ID,
    season,
    count: formattedGames.length,
    averages,
    games: formattedGames,
  };
}

module.exports = {
  getTeamGames,
  limitGames,
  fetchPlayerGames,
  findPlayerByName,
};
