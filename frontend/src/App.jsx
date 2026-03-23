import { useEffect, useRef, useState } from "react";
import "./App.css";

import { usePlayerDashboard } from "./hooks/usePlayerDashboard";
import { useTeamDashboard } from "./hooks/useTeamDashboard";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useBoxScore } from "./hooks/useBoxScore";
import {
  deriveTeamQuery,
  fetchPlayerDashboardData,
  fetchTeamDashboardData,
} from "./utils/dashboardFetchers";

import BettingSimulator from "./components/BettingSimulator";
import DashboardCarousel from "./components/dashboard/DashboardCarousel";
import PlayerDashboardView from "./components/dashboard/PlayerDashboardView";
import TeamDashboardView from "./components/dashboard/TeamDashboardView";

function App() {
  const [viewMode, setViewMode] = useState("dashboard");
  const [activeDashboardView, setActiveDashboardView] = useState("player");

  const [playerQuery, setPlayerQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");

  const [season, setSeason] = useState("2025-26");
  const [last, setLast] = useState(82);

  const [playerSelectedStat, setPlayerSelectedStat] = useState("points");
  const [teamSelectedStat, setTeamSelectedStat] = useState("points");

  const [playerGames, setPlayerGames] = useState([]);
  const [teamGames, setTeamGames] = useState([]);

  const [playerTitle, setPlayerTitle] = useState("Player");
  const [teamTitle, setTeamTitle] = useState("Team");

  const [playerLoading, setPlayerLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);

  const [playerError, setPlayerError] = useState("");
  const [teamError, setTeamError] = useState("");

  const [includeMissedGames, setIncludeMissedGames] = useState(false);

  const playerFilterState = useDashboardFilters();
  const teamFilterState = useDashboardFilters();

  const {
    filters: playerFilters,
    updateFilter: updatePlayerFilter,
    removeThresholdFilter: removePlayerThresholdFilter,
    toggleLocation: togglePlayerLocation,
    toggleResult: togglePlayerResult,
    clearFilters: clearPlayerFilters,
  } = playerFilterState;

  const {
    filters: teamFilters,
    updateFilter: updateTeamFilter,
    removeThresholdFilter: removeTeamThresholdFilter,
    toggleLocation: toggleTeamLocation,
    toggleResult: toggleTeamResult,
    clearFilters: clearTeamFilters,
  } = teamFilterState;

  const skipNextTeamAutoSearchRef = useRef(false);

  const boxScoreState = useBoxScore({
    getAllGames: () => [...playerGames, ...teamGames],
  });

  const {
    selectedGameId,
    selectedGame,
    boxScore,
    boxScoreLoading,
    boxScoreError,
    isBoxScoreOpen,
    setIsBoxScoreOpen,
    boxScoreRef,
    setSelectedGame,
    setSelectedGameId,
    setBoxScore,
    setBoxScoreError,
    setBoxScoreLoading,
    selectGame,
    reloadBoxScore,
  } = boxScoreState;

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
        const derivedTeamQuery = deriveTeamQuery(
          playerData.response,
          playerData.games,
        );

        if (!derivedTeamQuery) {
          setTeamQuery("");
          resetTeamDashboard();
          return playerData.games;
        }

        skipNextTeamAutoSearchRef.current = true;
        setTeamQuery(derivedTeamQuery);
        setTeamTitle(derivedTeamQuery);

        const teamData = await fetchTeamDashboardData(
          derivedTeamQuery,
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

  async function handleSelectGame(gameOrGameId) {
    await selectGame(gameOrGameId);
  }

  async function handleSelectTeamFromBoxScore(teamName) {
    if (!teamName) return;

    setActiveDashboardView("team");
    skipNextTeamAutoSearchRef.current = true;
    setTeamQuery(teamName);
    await loadTeamDashboard(teamName);
  }

  async function handleSelectPlayerFromBoxScore(playerName) {
    const trimmedPlayerName = String(playerName || "").trim();
    if (!trimmedPlayerName) return;

    const previousSelectedGameId =
      selectedGame?.gameId ||
      selectedGameId ||
      boxScore?.gameId ||
      boxScore?.game?.gameId ||
      null;

    const previousSelectedGame = selectedGame || null;

    setActiveDashboardView("player");
    setPlayerQuery(trimmedPlayerName);

    try {
      const normalizedPlayerGames =
        (await loadPlayerAndRelatedTeamDashboard(trimmedPlayerName)) || [];

      if (!previousSelectedGameId) return;

      const matchingGame = normalizedPlayerGames.find(
        (game) =>
          game?.gameId === previousSelectedGameId ||
          game?.GAME_ID === previousSelectedGameId,
      );

      if (matchingGame) {
        await selectGame(matchingGame);
        return;
      }

      setIsBoxScoreOpen(true);
      setSelectedGameId(previousSelectedGameId);
      setSelectedGame(
        previousSelectedGame || {
          gameId: previousSelectedGameId,
        },
      );
      setBoxScoreLoading(true);
      setBoxScoreError("");

      const response = await reloadBoxScore(previousSelectedGameId);

      requestAnimationFrame(() => {
        setTimeout(() => {
          boxScoreRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 50);
      });
    } catch (error) {
      console.error("Failed to switch to player from box score:", error);
      setBoxScoreError("Failed to load box score.");
      setBoxScore(null);
    } finally {
      setBoxScoreLoading(false);
    }
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

  const teamDashboard = useTeamDashboard({
    teamGames,
    filters: teamFilters,
    selectedStat: teamSelectedStat,
  });

  const playerDashboard = usePlayerDashboard({
    playerGames,
    teamGames,
    filters: playerFilters,
    selectedStat: playerSelectedStat,
    includeMissedGames,
    selectedGame,
  });

  const playerControls = {
    title: playerTitle,
    loading: playerLoading,
    error: playerError,
    query: playerQuery,
    setQuery: setPlayerQuery,
    season,
    setSeason,
    last,
    setLast,
    onSearch: handlePlayerSearch,
    filters: playerFilters,
    onUpdateFilter: updatePlayerFilter,
    onRemoveThresholdFilter: removePlayerThresholdFilter,
    onToggleLocation: togglePlayerLocation,
    onToggleResult: togglePlayerResult,
    onClearFilters: clearPlayerFilters,
    selectedStat: playerSelectedStat,
    setSelectedStat: setPlayerSelectedStat,
    includeMissedGames,
    setIncludeMissedGames,
  };

  const teamControls = {
    title: teamTitle,
    loading: teamLoading,
    error: teamError,
    query: teamQuery,
    setQuery: setTeamQuery,
    season,
    setSeason,
    last,
    setLast,
    onSearch: handleTeamSearch,
    filters: teamFilters,
    onUpdateFilter: updateTeamFilter,
    onRemoveThresholdFilter: removeTeamThresholdFilter,
    onToggleLocation: toggleTeamLocation,
    onToggleResult: toggleTeamResult,
    onClearFilters: clearTeamFilters,
    selectedStat: teamSelectedStat,
    setSelectedStat: setTeamSelectedStat,
  };

  const sharedBoxScoreState = {
    selectedGame,
    selectedGameId,
    onSelectGame: handleSelectGame,
    boxScore,
    boxScoreLoading,
    boxScoreError,
    isBoxScoreOpen,
    setIsBoxScoreOpen,
    boxScoreRef,
    onSelectPlayerFromBoxScore: handleSelectPlayerFromBoxScore,
    onSelectTeamFromBoxScore: handleSelectTeamFromBoxScore,
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-hero">
          <div className="app-hero-top">
            <div className="app-hero-copy">
              <p className="app-kicker">NBA analytics workspace</p>
              <h1 className="app-title">Basketball Stats Dashboard</h1>
              <p className="app-subtitle">
                Explore player and team trends, filter game logs, inspect box
                scores, and compare recent performance.
              </p>
            </div>

            <div className="app-hero-actions">
              <div className="segmented-group">
                <button
                  className={`segment-btn ${
                    viewMode === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("dashboard")}
                >
                  Dashboard
                </button>

                <button
                  className={`segment-btn ${
                    viewMode === "simulator" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("simulator")}
                >
                  Betting Simulator
                </button>
              </div>
            </div>
          </div>

          {viewMode === "dashboard" && (
            <div className="dashboard-view-switcher">
              <div className="segmented-group">
                <button
                  className={`segment-btn ${
                    activeDashboardView === "player" ? "active" : ""
                  }`}
                  onClick={() => setActiveDashboardView("player")}
                >
                  Player
                </button>

                <button
                  className={`segment-btn ${
                    activeDashboardView === "team" ? "active" : ""
                  }`}
                  onClick={() => setActiveDashboardView("team")}
                >
                  Team
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {viewMode === "dashboard" && (
        <DashboardCarousel
          activeDashboardView={activeDashboardView}
          setActiveDashboardView={setActiveDashboardView}
          playerView={
            <PlayerDashboardView
              dashboard={playerDashboard}
              controls={playerControls}
              boxScoreState={sharedBoxScoreState}
            />
          }
          teamView={
            <TeamDashboardView
              dashboard={teamDashboard}
              controls={teamControls}
              boxScoreState={sharedBoxScoreState}
            />
          }
        />
      )}

      {viewMode === "simulator" && (
        <div className="section-stack">
          <BettingSimulator
            games={playerGames}
            filteredGames={playerDashboard.filteredGames}
          />
        </div>
      )}
    </div>
  );
}

export default App;
