import { getPlayerGames, getTeamGames } from "../api/nbaApi";

const TEAM_ID_TO_NAME = {
  1610612737: "Atlanta Hawks",
  1610612738: "Boston Celtics",
  1610612751: "Brooklyn Nets",
  1610612766: "Charlotte Hornets",
  1610612741: "Chicago Bulls",
  1610612739: "Cleveland Cavaliers",
  1610612742: "Dallas Mavericks",
  1610612743: "Denver Nuggets",
  1610612765: "Detroit Pistons",
  1610612744: "Golden State Warriors",
  1610612745: "Houston Rockets",
  1610612754: "Indiana Pacers",
  1610612746: "LA Clippers",
  1610612747: "Los Angeles Lakers",
  1610612763: "Memphis Grizzlies",
  1610612748: "Miami Heat",
  1610612749: "Milwaukee Bucks",
  1610612750: "Minnesota Timberwolves",
  1610612740: "New Orleans Pelicans",
  1610612752: "New York Knicks",
  1610612760: "Oklahoma City Thunder",
  1610612753: "Orlando Magic",
  1610612755: "Philadelphia 76ers",
  1610612756: "Phoenix Suns",
  1610612757: "Portland Trail Blazers",
  1610612758: "Sacramento Kings",
  1610612759: "San Antonio Spurs",
  1610612761: "Toronto Raptors",
  1610612762: "Utah Jazz",
  1610612764: "Washington Wizards",
};

const TEAM_ABBR_TO_NAME = {
  ATL: "Atlanta Hawks",
  BOS: "Boston Celtics",
  BKN: "Brooklyn Nets",
  CHA: "Charlotte Hornets",
  CHI: "Chicago Bulls",
  CLE: "Cleveland Cavaliers",
  DAL: "Dallas Mavericks",
  DEN: "Denver Nuggets",
  DET: "Detroit Pistons",
  GSW: "Golden State Warriors",
  HOU: "Houston Rockets",
  IND: "Indiana Pacers",
  LAC: "LA Clippers",
  LAL: "Los Angeles Lakers",
  MEM: "Memphis Grizzlies",
  MIA: "Miami Heat",
  MIL: "Milwaukee Bucks",
  MIN: "Minnesota Timberwolves",
  NOP: "New Orleans Pelicans",
  NYK: "New York Knicks",
  OKC: "Oklahoma City Thunder",
  ORL: "Orlando Magic",
  PHI: "Philadelphia 76ers",
  PHX: "Phoenix Suns",
  POR: "Portland Trail Blazers",
  SAC: "Sacramento Kings",
  SAS: "San Antonio Spurs",
  TOR: "Toronto Raptors",
  UTA: "Utah Jazz",
  WAS: "Washington Wizards",
};

function isNonEmpty(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function isNumericOnly(value) {
  return /^\d+$/.test(String(value || "").trim());
}

function normalizeAbbreviation(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getTeamNameFromIdOrAbbr(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (isNumericOnly(raw)) {
    return TEAM_ID_TO_NAME[Number(raw)] || "";
  }

  const abbr = normalizeAbbreviation(raw);
  return TEAM_ABBR_TO_NAME[abbr] || "";
}

function getMatchupLeadingTeam(matchup) {
  const text = String(matchup || "").trim();
  if (!text) return "";

  const firstToken = text.split(" ")[0];
  return firstToken ? firstToken.trim() : "";
}

export function deriveTeamIdentifier(playerResponse, normalizedPlayerGames) {
  const directTeamId =
    playerResponse?.teamId ??
    playerResponse?.team_id ??
    normalizedPlayerGames?.[0]?.teamId ??
    normalizedPlayerGames?.[0]?.team_id;

  if (isNonEmpty(directTeamId)) {
    return String(directTeamId).trim();
  }

  const directTeamAbbr =
    playerResponse?.teamAbbreviation ||
    playerResponse?.team_abbreviation ||
    normalizedPlayerGames?.[0]?.teamAbbreviation ||
    normalizedPlayerGames?.[0]?.team_abbreviation ||
    "";

  if (isNonEmpty(directTeamAbbr)) {
    return String(directTeamAbbr).trim();
  }

  const directTeam =
    playerResponse?.teamName ||
    playerResponse?.team ||
    normalizedPlayerGames?.[0]?.teamName ||
    normalizedPlayerGames?.[0]?.team ||
    "";

  if (isNonEmpty(directTeam)) {
    return String(directTeam).trim();
  }

  const firstGame = normalizedPlayerGames?.[0];

  if (firstGame?.matchup) {
    const firstToken = getMatchupLeadingTeam(firstGame.matchup);
    if (firstToken) return firstToken;
  }

  return "";
}

export function deriveTeamDisplayName(playerResponse, normalizedPlayerGames) {
  const directReadableTeamName =
    playerResponse?.teamName || normalizedPlayerGames?.[0]?.teamName || "";

  if (
    isNonEmpty(directReadableTeamName) &&
    !isNumericOnly(directReadableTeamName)
  ) {
    return String(directReadableTeamName).trim();
  }

  const directAbbr =
    playerResponse?.teamAbbreviation ||
    playerResponse?.team_abbreviation ||
    normalizedPlayerGames?.[0]?.teamAbbreviation ||
    normalizedPlayerGames?.[0]?.team_abbreviation ||
    "";

  const readableFromAbbr = getTeamNameFromIdOrAbbr(directAbbr);
  if (readableFromAbbr) return readableFromAbbr;

  const directId =
    playerResponse?.teamId ??
    playerResponse?.team_id ??
    normalizedPlayerGames?.[0]?.teamId ??
    normalizedPlayerGames?.[0]?.team_id;

  const readableFromId = getTeamNameFromIdOrAbbr(directId);
  if (readableFromId) return readableFromId;

  const fallbackTeam =
    playerResponse?.team || normalizedPlayerGames?.[0]?.team || "";

  if (isNonEmpty(fallbackTeam) && !isNumericOnly(fallbackTeam)) {
    const readableFromFallback = getTeamNameFromIdOrAbbr(fallbackTeam);
    if (readableFromFallback) return readableFromFallback;

    return String(fallbackTeam).trim();
  }

  const matchupAbbr = getMatchupLeadingTeam(
    normalizedPlayerGames?.[0]?.matchup,
  );
  const readableFromMatchup = getTeamNameFromIdOrAbbr(matchupAbbr);
  if (readableFromMatchup) return readableFromMatchup;

  const fallbackIdentifier = deriveTeamIdentifier(
    playerResponse,
    normalizedPlayerGames,
  );

  const readableFromIdentifier = getTeamNameFromIdOrAbbr(fallbackIdentifier);
  if (readableFromIdentifier) return readableFromIdentifier;

  return "Team";
}

export async function fetchTeamDashboardData(teamIdentifier, last, season) {
  const response = await getTeamGames(teamIdentifier, last, season);

  const safeIdentifier = String(teamIdentifier || "").trim();
  const readableFallback =
    getTeamNameFromIdOrAbbr(safeIdentifier) || safeIdentifier;

  return {
    response,
    title: response?.teamName || response?.team || readableFallback,
    games: response?.games || [],
  };
}

export async function fetchPlayerDashboardData(playerName, last, season) {
  const response = await getPlayerGames(playerName, last, season);

  return {
    response,
    games: response?.games || [],
    title: response?.playerName || response?.player || playerName,
  };
}
