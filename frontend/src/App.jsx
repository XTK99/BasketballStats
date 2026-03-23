import { useState } from "react";
import "./App.css";

import { usePlayerDashboard } from "./hooks/usePlayerDashboard";
import { useTeamDashboard } from "./hooks/useTeamDashboard";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useBoxScore } from "./hooks/useBoxScore";
import { useDashboardSearches } from "./hooks/useDashboardSearches";
import { useDashboardControls } from "./hooks/useDashboardControls";

import BettingSimulator from "./components/BettingSimulator";
import DashboardCarousel from "./components/dashboard/DashboardCarousel";
import PlayerDashboardView from "./components/dashboard/PlayerDashboardView";
import TeamDashboardView from "./components/dashboard/TeamDashboardView";
import AppHeader from "./components/layout/AppHeader";

function App() {
  const [viewMode, setViewMode] = useState("dashboard");
  const [activeDashboardView, setActiveDashboardView] = useState("player");

  const [playerQuery, setPlayerQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");

  const [season, setSeason] = useState("2025-26");
  const [last, setLast] = useState(82);

  const [playerSelectedStat, setPlayerSelectedStat] = useState("points");
  const [teamSelectedStat, setTeamSelectedStat] = useState("points");

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

  const {
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
    skipNextTeamAutoSearchRef,
  } = useDashboardSearches({
    season,
    last,
    activeDashboardView,
    playerQuery,
    teamQuery,
    setTeamQuery,
  });

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

      await reloadBoxScore(previousSelectedGameId);

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

  const { playerControls, teamControls } = useDashboardControls({
    playerConfig: {
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
    },
    teamConfig: {
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
    },
  });

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
      <AppHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeDashboardView={activeDashboardView}
        setActiveDashboardView={setActiveDashboardView}
      />

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
