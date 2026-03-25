const API_BASE = "http://localhost:5000";

async function fetchJson(url, fallbackMessage) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = fallbackMessage;

    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      message = errorData.error || errorData.details || message;
    }

    throw new Error(message);
  }

  return response.json();
}

export async function searchTeams(query) {
  return fetchJson(
    `${API_BASE}/api/nba/team-search?q=${encodeURIComponent(query)}`,
    "Failed to search teams",
  );
}

export async function searchPlayers(query, season = "2025-26") {
  return fetchJson(
    `${API_BASE}/api/nba/player-search?q=${encodeURIComponent(
      query,
    )}&season=${encodeURIComponent(season)}`,
    "Failed to search players",
  );
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
  const normalizedIdentifier = String(teamIdentifier ?? "").trim();

  if (!normalizedIdentifier) {
    throw new Error("Team identifier is required");
  }

  const isNumericTeamId =
    typeof teamIdentifier === "number" || /^\d+$/.test(normalizedIdentifier);

  const teamParam = isNumericTeamId
    ? `teamId=${encodeURIComponent(normalizedIdentifier)}`
    : `teamName=${encodeURIComponent(normalizedIdentifier)}`;

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
