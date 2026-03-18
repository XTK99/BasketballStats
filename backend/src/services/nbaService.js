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

async function findPlayerByName(playerName) {
  const url =
    "https://stats.nba.com/stats/commonallplayers" +
    "?IsOnlyCurrentSeason=1" +
    "&LeagueID=00" +
    "&Season=2025-26";

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

  const normalizedSearch = playerName.trim().toLowerCase();

  const exactMatch = players.find(
    (player) => player.DISPLAY_FIRST_LAST?.toLowerCase() === normalizedSearch,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = players.find((player) =>
    player.DISPLAY_FIRST_LAST?.toLowerCase().includes(normalizedSearch),
  );

  if (!partialMatch) {
    throw new Error(`Player not found: ${playerName}`);
  }

  return partialMatch;
}

async function fetchPlayerGames(playerName, last = 5, season = "2025-26") {
  const player = await findPlayerByName(playerName);

  const url =
    "https://stats.nba.com/stats/playergamelog" +
    `?PlayerID=${player.PERSON_ID}` +
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
    player: player.DISPLAY_FIRST_LAST,
    playerId: player.PERSON_ID,
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
