import { useState } from "react";
import "./App.css";

import { usePlayerDashboard } from "./hooks/usePlayerDashboard";
import { useTeamDashboard } from "./hooks/useTeamDashboard";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useBoxScore } from "./hooks/useBoxScore";
import { useDashboardSearches } from "./hooks/useDashboardSearches";
import { useDashboardControls } from "./hooks/useDashboardControls";
import { useBoxScoreNavigation } from "./hooks/useBoxScoreNavigation";

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
    selectedGame,
    selectedGameId,
    boxScore,
    boxScoreLoading,
    boxScoreError,
    isBoxScoreOpen,
    setIsBoxScoreOpen,
    boxScoreRef,
  } = boxScoreState;

  const {
    handleSelectGame,
    handleSelectTeamFromBoxScore,
    handleSelectPlayerFromBoxScore,
  } = useBoxScoreNavigation({
    setActiveDashboardView,
    setPlayerQuery,
    setTeamQuery,
    skipNextTeamAutoSearchRef,
    loadTeamDashboard,
    loadPlayerAndRelatedTeamDashboard,
    boxScoreState,
  });

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
