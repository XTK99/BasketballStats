const API_BASE = "http://localhost:5000";

async function fetchJson(url, fallbackMessage) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    const errorData = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : {};
    throw new Error(errorData.error || fallbackMessage);
  }

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Expected JSON but got:", text.slice(0, 300));
    throw new Error("API did not return JSON.");
  }

  return response.json();
}

export async function getPlayerGames(
  playerName,
  gameCount = 5,
  season = "2025-26",
) {
  return fetchJson(
    `${API_BASE}/api/nba/player-games?player=${encodeURIComponent(
      playerName,
    )}&last=${encodeURIComponent(gameCount)}&season=${encodeURIComponent(
      season,
    )}`,
    "Failed to fetch player games",
  );
}

export async function getTeamGames(
  teamIdentifier,
  gameCount = 5,
  season = "2025-26",
) {
  const isNumericTeamId =
    typeof teamIdentifier === "number" || /^\d+$/.test(String(teamIdentifier));

  const teamParam = isNumericTeamId
    ? `teamId=${encodeURIComponent(teamIdentifier)}`
    : `teamName=${encodeURIComponent(teamIdentifier)}`;

  return fetchJson(
    `${API_BASE}/api/nba/team-games?${teamParam}&last=${encodeURIComponent(
      gameCount,
    )}&season=${encodeURIComponent(season)}`,
    "Failed to fetch team games",
  );
}

export async function getBoxScore(gameId) {
  return fetchJson(
    `${API_BASE}/api/nba/boxscore/${encodeURIComponent(gameId)}`,
    "Failed to fetch box score",
  );
}
