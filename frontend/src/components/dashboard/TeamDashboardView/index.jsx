import DashboardHeaderCard from "../DashboardHeaderCard";
import DashboardFilterSection from "../DashboardFilterSection";
import SearchBar from "../../SearchBar";
import SummaryCards from "../../SummaryCards";
import PropEdgeCard from "../../PropEdgeCard";
import SplitsPanel from "../../SplitsPanel";
import StatSelector from "../../StatSelector";
import StatChart from "../../StatChart";
import HitRateBoard from "../../HitRateBoard";
import GameLogTable from "../../GameLogTable";
import BoxScorePanel from "../../BoxScorePanel";
import "./TeamDashboardView.css";

function toSafeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function TeamDashboardView({ dashboard, controls, boxScoreState }) {
  const {
    title,
    loading,
    error,
    query,
    setQuery,
    season,
    setSeason,
    last,
    setLast,
    onSearch,
    filters,
    onUpdateFilter,
    onRemoveThresholdFilter,
    onToggleLocation,
    onToggleResult,
    onClearFilters,
    selectedStat,
    setSelectedStat,
  } = controls;

  const {
    selectedGame,
    selectedGameId,
    onSelectGame,
    boxScore,
    boxScoreLoading,
    boxScoreError,
    isBoxScoreOpen,
    setIsBoxScoreOpen,
    boxScoreRef,
    onSelectPlayerFromBoxScore,
    onSelectTeamFromBoxScore,
  } = boxScoreState;

  // ✅ NEW DASHBOARD SHAPE
  const games = dashboard?.games ?? [];
  const filteredGames = dashboard?.filteredGames ?? [];
  const chartData = dashboard?.chartData ?? [];
  const splits = dashboard?.splits ?? {};
  const hitRateBoard = dashboard?.hitRateBoard ?? [];
  const summary = dashboard?.summary ?? {};

  const loadedGames = toSafeNumber(summary.loadedGames, games.length);
  const filteredCount = toSafeNumber(
    summary.filteredCount,
    filteredGames.length,
  );
  const filteredPercent = summary.filteredPercent ?? "0.0";
  const averageSelectedStat = summary.averageSelectedStat ?? "0.0";

  // keep compatibility for old components
  const averages = dashboard?.averages ?? {
    [selectedStat]: averageSelectedStat,
    averageSelectedStat,
    loadedGames,
    filteredCount,
    filteredPercent,
  };

  const selectedLine = dashboard?.selectedLine ?? null;
  const propInsights = dashboard?.propInsights ?? null;

  return (
    <div className="section-stack">
      <DashboardHeaderCard heading="Team Dashboard" title={title}>
        <SearchBar
          mode="team"
          searchValue={query}
          setSearchValue={setQuery}
          season={season}
          setSeason={setSeason}
          last={last}
          setLast={setLast}
          onSearch={onSearch}
          showSearchButton={false}
        />
      </DashboardHeaderCard>

      {loading && <p className="status-message">Loading team dashboard...</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {!loading && !error && (
        <>
          <DashboardFilterSection
            filters={filters}
            onUpdateFilter={onUpdateFilter}
            onRemoveThresholdFilter={onRemoveThresholdFilter}
            onToggleLocation={onToggleLocation}
            onToggleResult={onToggleResult}
            onClearFilters={onClearFilters}
          />

          <SummaryCards
            averages={averages}
            selectedStat={selectedStat}
            onSelectStat={setSelectedStat}
          />

          <PropEdgeCard
            title={title}
            selectedStat={selectedStat}
            selectedLine={selectedLine}
            insights={propInsights}
          />

          <SplitsPanel
            splits={splits}
            games={filteredGames}
            selectedStat={selectedStat}
          />

          <section className="panel-card">
            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />

            <StatChart
              data={chartData}
              games={filteredGames}
              selectedStat={selectedStat}
              mode="team"
              onSelectGame={onSelectGame}
              selectedGameId={selectedGameId}
            />
          </section>

          <HitRateBoard
            data={hitRateBoard}
            games={filteredGames}
            selectedStat={selectedStat}
            mode="team"
          />

          <section ref={boxScoreRef} className="section-stack">
            {(selectedGame || boxScoreLoading || boxScoreError) && (
              <section className="panel-card selected-game-card">
                <div className="selected-game-header">
                  <div>
                    <h3 className="panel-title">Selected Game</h3>
                    <p className="selected-game-subtitle">
                      {selectedGame
                        ? `${selectedGame.gameDate} • ${selectedGame.matchup} • ${
                            selectedGame.result || "—"
                          }`
                        : "Loading selected game..."}
                    </p>
                  </div>

                  <div className="selected-game-actions">
                    <button
                      type="button"
                      className="collapse-button"
                      onClick={() => setIsBoxScoreOpen((prev) => !prev)}
                    >
                      {isBoxScoreOpen ? "Hide Box Score" : "Show Box Score"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </section>

          {isBoxScoreOpen && (
            <BoxScorePanel
              boxScore={boxScore}
              loading={boxScoreLoading}
              error={boxScoreError}
              selectedPlayerName=""
              onSelectPlayer={onSelectPlayerFromBoxScore}
              onSelectTeam={onSelectTeamFromBoxScore}
            />
          )}

          <GameLogTable
            games={filteredGames}
            onSelectGame={onSelectGame}
            selectedGameId={selectedGameId}
          />
        </>
      )}
    </div>
  );
}

export default TeamDashboardView;
