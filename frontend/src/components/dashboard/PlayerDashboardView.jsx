import DashboardHeaderCard from "./DashboardHeaderCard";
import DashboardFilterSection from "./DashboardFilterSection";
import SearchBar from "../SearchBar";
import SummaryCards from "../SummaryCards";

import PropEdgeCard from "../PropEdgeCard";
import SplitsPanel from "../SplitsPanel";
import StatSelector from "../StatSelector";
import StatChart from "../StatChart";
import HitRateBoard from "../HitRateBoard";
import GameLogTable from "../GameLogTable";
import BoxScorePanel from "../BoxScorePanel";
import "./PlayerDashboardView.css";

const STAT_LABEL_MAP = {
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",
  minutes: "Minutes",
  threesMade: "3PM",
};

function PlayerDashboardView({
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
  averages,
  matchupOpponent,
  selectedStat,
  setSelectedStat,
  boardStat,
  setBoardStat,
  filteredGames,
  selectedLine,
  propInsights,
  matchupSnapshot,
  selectedGame,
  selectedGameId,
  onSelectGame,
  boxScore,
  boxScoreLoading,
  boxScoreError,
  isBoxScoreOpen,
  setIsBoxScoreOpen,
  boxScoreRef,
}) {
  return (
    <div className="section-stack">
      <DashboardHeaderCard heading="Player Dashboard" title={title}>
        <SearchBar
          mode="player"
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

      {loading && <p className="status-message">Loading player dashboard...</p>}
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

          <SummaryCards averages={averages} />

          <PropEdgeCard
            title={title}
            statLabel={STAT_LABEL_MAP[selectedStat] || selectedStat}
            insights={propInsights}
          />

          <SplitsPanel games={filteredGames} />

          <section className="panel-card">
            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />
            <StatChart
              games={filteredGames}
              selectedStat={selectedStat}
              mode="player"
            />
          </section>

          <HitRateBoard
            games={filteredGames}
            selectedStat={selectedStat}
            boardStat={boardStat}
            setBoardStat={setBoardStat}
            mode="player"
          />

          {isBoxScoreOpen && (
            <BoxScorePanel
              boxScore={boxScore}
              loading={boxScoreLoading}
              error={boxScoreError}
              selectedPlayerName={query}
            />
          )}

          <GameLogTable
            games={filteredGames}
            onSelectGame={onSelectGame}
            selectedGameId={selectedGameId}
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
        </>
      )}
    </div>
  );
}

export default PlayerDashboardView;
