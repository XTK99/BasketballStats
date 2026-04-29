import { useMemo, useState } from "react";
import "./NBAApp.css";

import { usePlayerDashboard } from "./hooks/usePlayerDashboard";
import { useTeamDashboard } from "./hooks/useTeamDashboard";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useBoxScore } from "./hooks/useBoxScore";
import { useDashboardSearches } from "./hooks/useDashboardSearches";
import { useDashboardControls } from "./hooks/useDashboardControls";
import { useBoxScoreNavigation } from "./hooks/useBoxScoreNavigation";
import { useSavedPages } from "./hooks/useSavedPages";

import BettingSimulator from "./components/BettingSimulator";
import DashboardCarousel from "./components/dashboard/DashboardCarousel";
import PlayerDashboardView from "./components/dashboard/PlayerDashboardView";
import TeamDashboardView from "./components/dashboard/TeamDashboardView";
import AppHeader from "./components/layout/AppHeader";
import SavedPagesBar from "./components/layout/SavedPagesBar";

function NBAApp() {
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
    setFilters: setPlayerFilters,
    updateFilter: updatePlayerFilter,
    removeThresholdFilter: removePlayerThresholdFilter,
    toggleLocation: togglePlayerLocation,
    toggleResult: togglePlayerResult,
    clearFilters: clearPlayerFilters,
  } = playerFilterState;

  const {
    filters: teamFilters,
    setFilters: setTeamFilters,
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

  const { savedPages, savePage, deletePage } = useSavedPages();

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

  function handleSaveCurrentPage() {
    if (activeDashboardView === "player") {
      const trimmedName = playerQuery.trim();
      if (!trimmedName) return;

      const customLabel = window.prompt(
        "Save player page as:",
        `${trimmedName} (${playerSelectedStat}, last ${last})`,
      );

      if (customLabel === null) return;

      savePage({
        type: "player",
        label: customLabel.trim() || trimmedName,
        name: trimmedName,
        season,
        last,
        selectedStat: playerSelectedStat,
        filters: playerFilters,
        includeMissedGames,
      });

      return;
    }

    const trimmedName = teamQuery.trim();
    if (!trimmedName) return;

    const customLabel = window.prompt(
      "Save team page as:",
      `${trimmedName} (${teamSelectedStat}, last ${last})`,
    );

    if (customLabel === null) return;

    savePage({
      type: "team",
      label: customLabel.trim() || trimmedName,
      name: trimmedName,
      season,
      last,
      selectedStat: teamSelectedStat,
      filters: teamFilters,
    });
  }

  async function handleLoadSavedPage(page) {
    if (!page) return;

    setViewMode("dashboard");
    setSeason(page.season || "2025-26");
    setLast(page.last || 82);

    if (page.type === "player") {
      setActiveDashboardView("player");
      setPlayerSelectedStat(page.selectedStat || "points");
      setIncludeMissedGames(Boolean(page.includeMissedGames));
      setPlayerFilters(page.filters || playerFilters);
      setPlayerQuery(page.name || "");

      await handlePlayerSearch(page.name, {
        season: page.season,
        last: page.last,
      });

      return;
    }

    setActiveDashboardView("team");
    setTeamSelectedStat(page.selectedStat || "points");
    setTeamFilters(page.filters || teamFilters);
    setTeamQuery(page.name || "");
    skipNextTeamAutoSearchRef.current = true;

    await handleTeamSearch(page.name, {
      season: page.season,
      last: page.last,
    });
  }

  const playerConfig = useMemo(
    () => ({
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
    }),
    [
      playerTitle,
      playerLoading,
      playerError,
      playerQuery,
      season,
      last,
      handlePlayerSearch,
      playerFilters,
      updatePlayerFilter,
      removePlayerThresholdFilter,
      togglePlayerLocation,
      togglePlayerResult,
      clearPlayerFilters,
      playerSelectedStat,
      includeMissedGames,
    ],
  );

  const teamConfig = useMemo(
    () => ({
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
    }),
    [
      teamTitle,
      teamLoading,
      teamError,
      teamQuery,
      season,
      last,
      handleTeamSearch,
      teamFilters,
      updateTeamFilter,
      removeTeamThresholdFilter,
      toggleTeamLocation,
      toggleTeamResult,
      clearTeamFilters,
      teamSelectedStat,
    ],
  );

  const { playerControls, teamControls } = useDashboardControls({
    playerConfig,
    teamConfig,
  });

  const sharedBoxScoreState = useMemo(
    () => ({
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
    }),
    [
      selectedGame,
      selectedGameId,
      handleSelectGame,
      boxScore,
      boxScoreLoading,
      boxScoreError,
      isBoxScoreOpen,
      setIsBoxScoreOpen,
      boxScoreRef,
      handleSelectPlayerFromBoxScore,
      handleSelectTeamFromBoxScore,
    ],
  );

  return (
    <div className="app-shell">
      <AppHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeDashboardView={activeDashboardView}
        setActiveDashboardView={setActiveDashboardView}
      />

      {viewMode === "dashboard" && (
        <>
          <SavedPagesBar
            savedPages={savedPages}
            onSaveCurrentPage={handleSaveCurrentPage}
            onLoadPage={handleLoadSavedPage}
            onDeletePage={deletePage}
          />

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
        </>
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

export default NBAApp;
