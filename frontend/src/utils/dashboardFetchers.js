import { getPlayerGames, getTeamGames } from "../api/nbaApi";
import { normalizeGames } from "./normalizeGames";

export function deriveTeamQuery(playerResponse, normalizedPlayerGames) {
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

export async function fetchTeamDashboardData(teamName, last, season) {
  const response = await getTeamGames(teamName, last, season);

  return {
    response,
    title: response?.teamName || teamName,
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
