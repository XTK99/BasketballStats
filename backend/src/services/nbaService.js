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
    teamId: player.TEAM_ID,
    teamName: player.TEAM_NAME,
    teamAbbreviation: player.TEAM_ABBREVIATION,
    season,
    count: formattedGames.length,
    averages,
    games: formattedGames,
  };
}

async function fetchBoxScoreByGameId(gameId) {
  const url =
    "https://stats.nba.com/stats/boxscoretraditionalv3" + `?GameID=${gameId}`;

  const response = await fetch(url, {
    headers: NBA_HEADERS,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("NBA API error:", text);
    throw new Error(`Failed to fetch box score: ${response.status}`);
  }

  const data = await response.json();
  console.log("RAW BOX SCORE RESPONSE:", JSON.stringify(data, null, 2));

  const gameData = data.game || data.boxScoreTraditional || data;

  const homeTeam = gameData.homeTeam;
  const awayTeam = gameData.awayTeam;

  if (!homeTeam || !awayTeam) {
    console.log("Could not find homeTeam/awayTeam in:", Object.keys(data));
    throw new Error("Box score data missing from NBA API response");
  }

  function normalizeTeam(team) {
    return {
      TEAM_ID: team.teamId,
      TEAM_ABBREVIATION: team.teamTricode,
      TEAM_CITY: team.teamCity,
      TEAM_NAME: team.teamName,
      MIN: team.statistics?.minutes || "",
      FGM: team.statistics?.fieldGoalsMade ?? 0,
      FGA: team.statistics?.fieldGoalsAttempted ?? 0,
      FG_PCT: team.statistics?.fieldGoalsPercentage ?? 0,
      FG3M: team.statistics?.threePointersMade ?? 0,
      FG3A: team.statistics?.threePointersAttempted ?? 0,
      FG3_PCT: team.statistics?.threePointersPercentage ?? 0,
      FTM: team.statistics?.freeThrowsMade ?? 0,
      FTA: team.statistics?.freeThrowsAttempted ?? 0,
      FT_PCT: team.statistics?.freeThrowsPercentage ?? 0,
      OREB: team.statistics?.reboundsOffensive ?? 0,
      DREB: team.statistics?.reboundsDefensive ?? 0,
      REB: team.statistics?.reboundsTotal ?? 0,
      AST: team.statistics?.assists ?? 0,
      STL: team.statistics?.steals ?? 0,
      BLK: team.statistics?.blocks ?? 0,
      TOV: team.statistics?.turnovers ?? 0,
      PF: team.statistics?.foulsPersonal ?? 0,
      PTS: team.statistics?.points ?? 0,
      PLUS_MINUS: team.statistics?.plusMinusPoints ?? 0,
    };
  }

  function normalizePlayers(team) {
    return (team.players || []).map((player) => ({
      PLAYER_ID: player.personId,
      PLAYER_NAME:
        `${player.firstName || ""} ${player.familyName || ""}`.trim(),
      TEAM_ID: team.teamId,
      START_POSITION: player.position || "",
      COMMENT: player.comment || "",
      MIN: player.statistics?.minutes || "",
      FGM: player.statistics?.fieldGoalsMade ?? 0,
      FGA: player.statistics?.fieldGoalsAttempted ?? 0,
      FG_PCT: player.statistics?.fieldGoalsPercentage ?? 0,
      FG3M: player.statistics?.threePointersMade ?? 0,
      FG3A: player.statistics?.threePointersAttempted ?? 0,
      FG3_PCT: player.statistics?.threePointersPercentage ?? 0,
      FTM: player.statistics?.freeThrowsMade ?? 0,
      FTA: player.statistics?.freeThrowsAttempted ?? 0,
      FT_PCT: player.statistics?.freeThrowsPercentage ?? 0,
      OREB: player.statistics?.reboundsOffensive ?? 0,
      DREB: player.statistics?.reboundsDefensive ?? 0,
      REB: player.statistics?.reboundsTotal ?? 0,
      AST: player.statistics?.assists ?? 0,
      STL: player.statistics?.steals ?? 0,
      BLK: player.statistics?.blocks ?? 0,
      TOV: player.statistics?.turnovers ?? 0,
      PF: player.statistics?.foulsPersonal ?? 0,
      PTS: player.statistics?.points ?? 0,
      PLUS_MINUS: player.statistics?.plusMinusPoints ?? 0,
    }));
  }

  const teams = [normalizeTeam(homeTeam), normalizeTeam(awayTeam)];
  const players = [
    ...normalizePlayers(homeTeam),
    ...normalizePlayers(awayTeam),
  ];

  return {
    gameId,
    teams,
    players,
  };
}

module.exports = {
  getTeamGames,
  limitGames,
  fetchPlayerGames,
  findPlayerByName,

  fetchBoxScoreByGameId,
};
