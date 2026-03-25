import { useEffect, useRef, useState } from "react";
import {
  deriveTeamDisplayName,
  deriveTeamIdentifier,
  fetchPlayerDashboardData,
  fetchTeamDashboardData,
} from "../utils/dashboardFetchers";

function normalizeDashboardPayload(data, fallbackTitle = "Dashboard") {
  const safeData = data && typeof data === "object" ? data : {};

  const games = Array.isArray(safeData.games)
    ? safeData.games
    : Array.isArray(safeData.data)
      ? safeData.data
      : Array.isArray(safeData.results)
        ? safeData.results
        : [];

  const title =
    safeData.title ||
    safeData.name ||
    safeData.teamName ||
    safeData.playerName ||
    fallbackTitle;

  return {
    games,
    title,
    response: safeData.response || safeData.raw || safeData,
  };
}

export function useDashboardSearches({
  season,
  last,
  activeDashboardView,
  playerQuery,
  teamQuery,
  setTeamQuery,
}) {
  const [playerGames, setPlayerGames] = useState([]);
  const [teamGames, setTeamGames] = useState([]);

  const [playerTitle, setPlayerTitle] = useState("Player");
  const [teamTitle, setTeamTitle] = useState("Team");

  const [playerLoading, setPlayerLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);

  const [playerError, setPlayerError] = useState("");
  const [teamError, setTeamError] = useState("");

  const skipNextTeamAutoSearchRef = useRef(false);

  function resetPlayerDashboard() {
    setPlayerGames([]);
    setPlayerTitle("Player");
    setPlayerError("");
  }

  function resetTeamDashboard() {
    setTeamGames([]);
    setTeamTitle("Team");
    setTeamError("");
  }

  async function loadTeamDashboard(teamName, overrides = {}) {
    const trimmedQuery = String(teamName || "").trim();
    const seasonToUse = overrides.season ?? season;
    const lastToUse = overrides.last ?? last;

    if (!trimmedQuery) {
      resetTeamDashboard();
      return [];
    }

    try {
      setTeamLoading(true);
      setTeamError("");

      console.log("loadTeamDashboard called:", {
        teamName: trimmedQuery,
        season: seasonToUse,
        last: lastToUse,
      });

      const rawData = await fetchTeamDashboardData(
        trimmedQuery,
        lastToUse,
        seasonToUse,
      );

      const data = normalizeDashboardPayload(rawData, trimmedQuery);

      console.log("loadTeamDashboard response:", data);

      setTeamGames(data.games);
      setTeamTitle(data.title || trimmedQuery);

      return data.games;
    } catch (error) {
      console.error("Team fetch failed:", error);
      setTeamError(error?.message || "Failed to load team dashboard.");
      setTeamGames([]);
      return [];
    } finally {
      setTeamLoading(false);
    }
  }

  async function loadPlayerAndRelatedTeamDashboard(playerName, overrides = {}) {
    const trimmedQuery = String(playerName || "").trim();
    const seasonToUse = overrides.season ?? season;
    const lastToUse = overrides.last ?? last;

    if (!trimmedQuery) {
      resetPlayerDashboard();
      resetTeamDashboard();
      return [];
    }

    try {
      setPlayerLoading(true);
      setTeamLoading(true);
      setPlayerError("");
      setTeamError("");

      console.log("loadPlayerAndRelatedTeamDashboard called:", {
        playerName: trimmedQuery,
        season: seasonToUse,
        last: lastToUse,
      });

      const rawPlayerData = await fetchPlayerDashboardData(
        trimmedQuery,
        lastToUse,
        seasonToUse,
      );

      const playerData = normalizeDashboardPayload(rawPlayerData, trimmedQuery);

      console.log("player dashboard response:", playerData);

      setPlayerGames(playerData.games);
      setPlayerTitle(playerData.title || trimmedQuery);

      try {
        const derivedTeamIdOrAbbr = deriveTeamIdentifier(
          playerData.response,
          playerData.games,
        );
        const derivedTeamName = deriveTeamDisplayName(
          playerData.response,
          playerData.games,
        );

        console.log("derived team values:", {
          derivedTeamIdOrAbbr,
          derivedTeamName,
        });

        if (!derivedTeamIdOrAbbr && !derivedTeamName) {
          setTeamQuery("");
          resetTeamDashboard();
          return playerData.games;
        }

        const teamSearchValue = String(
          derivedTeamIdOrAbbr || derivedTeamName || "",
        ).trim();

        skipNextTeamAutoSearchRef.current = true;
        setTeamQuery(String(derivedTeamName || teamSearchValue || ""));
        setTeamTitle(derivedTeamName || "Team");

        const rawTeamData = await fetchTeamDashboardData(
          teamSearchValue,
          lastToUse,
          seasonToUse,
        );

        const teamData = normalizeDashboardPayload(
          rawTeamData,
          derivedTeamName || teamSearchValue || "Team",
        );

        console.log("related team dashboard response:", teamData);

        setTeamGames(teamData.games);
        setTeamTitle(
          teamData.title || derivedTeamName || teamSearchValue || "Team",
        );
        setTeamError("");
      } catch (relatedTeamError) {
        console.error("Related team fetch failed:", relatedTeamError);
        setTeamGames([]);
        setTeamError(
          relatedTeamError?.message || "Failed to load team dashboard.",
        );
      }

      return playerData.games;
    } catch (error) {
      console.error("Player fetch failed:", error);
      setPlayerError(error?.message || "Failed to load player dashboard.");
      setPlayerGames([]);
      return [];
    } finally {
      setPlayerLoading(false);
      setTeamLoading(false);
    }
  }

  async function handlePlayerSearch(queryOverride, overrides = {}) {
    return loadPlayerAndRelatedTeamDashboard(
      queryOverride ?? playerQuery,
      overrides,
    );
  }

  async function handleTeamSearch(queryOverride, overrides = {}) {
    return loadTeamDashboard(queryOverride ?? teamQuery, overrides);
  }

  useEffect(() => {
    const trimmedQuery = String(playerQuery || "").trim();

    if (!trimmedQuery) {
      resetPlayerDashboard();
      resetTeamDashboard();
      return;
    }

    const timeoutId = setTimeout(() => {
      handlePlayerSearch();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [playerQuery, season, last]);

  useEffect(() => {
    if (activeDashboardView !== "team") return;

    if (skipNextTeamAutoSearchRef.current) {
      skipNextTeamAutoSearchRef.current = false;
      return;
    }

    const trimmedQuery = String(teamQuery || "").trim();

    if (!trimmedQuery) {
      resetTeamDashboard();
      return;
    }

    const shouldFetch = teamGames.length === 0 || teamTitle === "Team";

    const timeoutId = setTimeout(() => {
      if (shouldFetch) {
        handleTeamSearch();
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [
    teamQuery,
    season,
    last,
    activeDashboardView,
    teamGames.length,
    teamTitle,
  ]);

  return {
    playerGames,
    teamGames,
    playerTitle,
    teamTitle,
    playerLoading,
    teamLoading,
    playerError,
    teamError,
    loadTeamDashboard,
    loadPlayerAndRelatedTeamDashboard,
    handlePlayerSearch,
    handleTeamSearch,
    resetPlayerDashboard,
    resetTeamDashboard,
    skipNextTeamAutoSearchRef,
  };
}
