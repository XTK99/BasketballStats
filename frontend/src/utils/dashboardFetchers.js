import { getPlayerGames, getTeamGames } from "../api/nbaApi";
import { normalizeGames } from "./normalizeGames";

export function deriveTeamIdentifier(playerResponse, normalizedPlayerGames) {
  const directTeamId =
    playerResponse?.teamId ??
    playerResponse?.team_id ??
    normalizedPlayerGames?.[0]?.teamId ??
    normalizedPlayerGames?.[0]?.team_id;

  if (
    directTeamId !== undefined &&
    directTeamId !== null &&
    String(directTeamId).trim() !== ""
  ) {
    return directTeamId;
  }

  const directTeam =
    playerResponse?.teamName ||
    playerResponse?.team ||
    playerResponse?.teamAbbreviation ||
    playerResponse?.team_abbreviation ||
    "";

  if (directTeam) return String(directTeam).trim();

  const firstGame = normalizedPlayerGames?.[0];

  if (firstGame?.teamName) return String(firstGame.teamName).trim();
  if (firstGame?.team) return String(firstGame.team).trim();
  if (firstGame?.teamAbbreviation) {
    return String(firstGame.teamAbbreviation).trim();
  }

  if (firstGame?.matchup) {
    const firstToken = String(firstGame.matchup).trim().split(" ")[0];
    if (firstToken) return firstToken;
  }

  return "";
}

export function deriveTeamDisplayName(playerResponse, normalizedPlayerGames) {
  const directTeamName =
    playerResponse?.teamName ||
    playerResponse?.team ||
    normalizedPlayerGames?.[0]?.teamName ||
    normalizedPlayerGames?.[0]?.team ||
    normalizedPlayerGames?.[0]?.teamAbbreviation ||
    normalizedPlayerGames?.[0]?.team_abbreviation ||
    "";

  if (directTeamName) return String(directTeamName).trim();

  const fallbackIdentifier = deriveTeamIdentifier(
    playerResponse,
    normalizedPlayerGames,
  );

  return fallbackIdentifier ? String(fallbackIdentifier).trim() : "Team";
}

export async function fetchTeamDashboardData(teamIdentifier, last, season) {
  const response = await getTeamGames(teamIdentifier, last, season);

  return {
    response,
    title:
      response?.teamName || response?.team || String(teamIdentifier).trim(),
    games: normalizeGames(response?.games || [], "team"),
  };
}

export async function fetchPlayerDashboardData(playerName, last, season) {
  const response = await getPlayerGames(playerName, last, season);
  const games = normalizeGames(response?.games || [], "player");

  return {
    response,
    games,
    title: response?.playerName || response?.player || playerName,
  };
}
