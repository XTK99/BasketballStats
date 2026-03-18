const { NBA_HEADERS } = require("../utils/nbaHeaders");

async function getTeamGames(teamId, season = "2025-26") {
  const url =
    "https://stats.nba.com/stats/teamgamelog" +
    `?TeamID=${teamId}` +
    `&Season=${season}` +
    "&SeasonType=Regular+Season" +
    "&LeagueID=00";

  console.time("getTeamGames");

  const response = await fetch(url, {
    headers: NBA_HEADERS,
  });

  console.timeEnd("getTeamGames");

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

module.exports = {
  getTeamGames,
  limitGames,
};
