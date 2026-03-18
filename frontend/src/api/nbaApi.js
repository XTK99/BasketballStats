export async function getPlayerGames(player, last = 5, season = "2025-26") {
  const url = `http://localhost:5000/api/nba/player-games?player=${encodeURIComponent(player)}&last=${last}&season=${season}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.details || "Failed to fetch player games");
  }

  return response.json();
}

export async function getTeamGames(teamName, last = 5, season = "2025-26") {
  const url = `http://localhost:5000/api/nba/team-games?teamName=${encodeURIComponent(teamName)}&last=${last}&season=${season}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.details || "Failed to fetch team games");
  }

  return response.json();
}
