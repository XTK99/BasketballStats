import { useEffect, useRef, useState } from "react";
import {
  deriveTeamQuery,
  fetchPlayerDashboardData,
  fetchTeamDashboardData,
} from "../utils/dashboardFetchers";

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

  async function loadTeamDashboard(teamName) {
    const trimmedQuery = String(teamName || "").trim();

    if (!trimmedQuery) {
      resetTeamDashboard();
      return [];
    }

    try {
      setTeamLoading(true);
      setTeamError("");

      const data = await fetchTeamDashboardData(trimmedQuery, last, season);

      setTeamGames(data.games);
      setTeamTitle(data.title);

      return data.games;
    } catch (error) {
      console.error("Team fetch failed:", error);
      setTeamError("Failed to load team dashboard.");
      setTeamGames([]);
      return [];
    } finally {
      setTeamLoading(false);
    }
  }

  async function loadPlayerAndRelatedTeamDashboard(playerName) {
    const trimmedQuery = String(playerName || "").trim();

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

      const playerData = await fetchPlayerDashboardData(
        trimmedQuery,
        last,
        season,
      );

      setPlayerGames(playerData.games);
      setPlayerTitle(playerData.title);

      try {
        const derivedTeam = deriveTeamQuery(
          playerData.response,
          playerData.games,
        );

        if (!derivedTeam) {
          setTeamQuery("");
          resetTeamDashboard();
          return playerData.games;
        }

        skipNextTeamAutoSearchRef.current = true;
        setTeamQuery(derivedTeam);
        setTeamTitle(derivedTeam);

        const teamData = await fetchTeamDashboardData(
          derivedTeam,
          last,
          season,
        );

        setTeamGames(teamData.games);
        setTeamTitle(teamData.title);
        setTeamError("");
      } catch (teamError) {
        console.error("Related team fetch failed:", teamError);
        setTeamGames([]);
        setTeamError("Failed to load team dashboard.");
      }

      return playerData.games;
    } catch (error) {
      console.error("Player fetch failed:", error);
      setPlayerError("Failed to load player dashboard.");
      setPlayerGames([]);
      return [];
    } finally {
      setPlayerLoading(false);
      setTeamLoading(false);
    }
  }

  async function handlePlayerSearch() {
    await loadPlayerAndRelatedTeamDashboard(playerQuery);
  }

  async function handleTeamSearch() {
    await loadTeamDashboard(teamQuery);
  }

  useEffect(() => {
    const trimmedQuery = playerQuery.trim();

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

    const trimmedQuery = teamQuery.trim();

    if (!trimmedQuery) {
      resetTeamDashboard();
      return;
    }

    const timeoutId = setTimeout(() => {
      handleTeamSearch();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [teamQuery, season, last, activeDashboardView]);

  return {
    playerGames,
    teamGames,
    playerTitle,
    teamTitle,
    playerLoading,
    teamLoading,
    playerError,
    teamError,
    setPlayerGames,
    setTeamGames,
    setPlayerTitle,
    setTeamTitle,
    setPlayerError,
    setTeamError,
    setTeamLoading,
    loadTeamDashboard,
    loadPlayerAndRelatedTeamDashboard,
    handlePlayerSearch,
    handleTeamSearch,
    resetPlayerDashboard,
    resetTeamDashboard,
    skipNextTeamAutoSearchRef,
  };
}
