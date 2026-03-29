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

/* =========================
   PLAYER SEARCH (DB-BASED)
========================= */
export async function searchPlayers(query, season = "2025-26") {
  if (!query || query.trim().length < 2) {
    return []; // prevent spam calls + matches your UI behavior
  }

  return fetchJson(
    `${API_BASE}/api/nba/player-search?q=${encodeURIComponent(
      query,
    )}&season=${encodeURIComponent(season)}`,
    "Failed to search players",
  );
}

/* =========================
   PLAYER GAMES
========================= */
export async function getPlayerGames(
  playerName,
  gameCount = 5,
  season = "2025-26",
) {
  if (!playerName) {
    throw new Error("Player name is required");
  }

  return fetchJson(
    `${API_BASE}/api/nba/player-games?player=${encodeURIComponent(
      playerName,
    )}&last=${encodeURIComponent(gameCount)}&season=${encodeURIComponent(
      season,
    )}`,
    "Failed to fetch player games",
  );
}

/* =========================
   TEAM SEARCH (NOT BUILT YET)
========================= */
// ⚠️ You don't have /team-search route yet
// Keep this if you plan to add it, otherwise remove it
export async function searchTeams(query) {
  return fetchJson(
    `${API_BASE}/api/nba/team-search?q=${encodeURIComponent(query)}`,
    "Failed to search teams",
  );
}

/* =========================
   TEAM GAMES
========================= */
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

/* =========================
   BOX SCORE
========================= */
export async function getBoxScore(gameId) {
  if (!gameId) {
    throw new Error("Game ID is required");
  }

  return fetchJson(
    `${API_BASE}/api/nba/boxscore/${encodeURIComponent(gameId)}`,
    "Failed to fetch box score",
  );
}
