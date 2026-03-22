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
  selectedStat,
  setSelectedStat,
  allGames,
  filteredGames,
  includeMissedGames,
  setIncludeMissedGames,
  playedGamesCount,
  sampleGamesCount,
  hitsPlayedCount,
  hitsSampleCount,
  selectedLine,
  propInsights,
  selectedGame,
  selectedGameId,
  onSelectGame,
  onSelectPlayerFromBoxScore,
  boxScore,
  boxScoreLoading,
  boxScoreError,
  isBoxScoreOpen,
  setIsBoxScoreOpen,
  boxScoreRef,
  onSelectTeamFromBoxScore,
  hitRateStat,
  hitRateLine,
  seasonPlayedCount,
  seasonMissedCount,
}) {
  const safePlayedGamesCount = Number.isFinite(playedGamesCount)
    ? playedGamesCount
    : 0;

  const safeSampleGamesCount = Number.isFinite(sampleGamesCount)
    ? sampleGamesCount
    : 0;

  const safeSeasonPlayedCount = Number.isFinite(seasonPlayedCount)
    ? seasonPlayedCount
    : 0;

  const safeSeasonMissedCount = Number.isFinite(seasonMissedCount)
    ? seasonMissedCount
    : 0;

  const safeHitsPlayedCount = Number.isFinite(hitsPlayedCount)
    ? hitsPlayedCount
    : 0;

  const safeHitsSampleCount = Number.isFinite(hitsSampleCount)
    ? hitsSampleCount
    : 0;

  return (
    <div className="section-stack">
      <DashboardHeaderCard heading="Player Dashboard" title={title}>
        <div className="player-header-row">
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

          <div className="player-status-row">
            <div className="games-played-chip">
              <div className="games-played-main">
                <span className="games-played-value">
                  {safeHitsPlayedCount}
                </span>
                <span className="games-played-divider">/</span>
                <span className="games-sample-value">
                  {safeSeasonPlayedCount}
                </span>
              </div>
              <div className="games-played-label">Hits</div>
            </div>

            <div className="games-played-chip missed-chip">
              <div className="games-played-main">
                <span className="games-played-value">
                  {safeSeasonMissedCount}
                </span>
              </div>
              <div className="games-played-label">Missed</div>
            </div>
          </div>
        </div>
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
            playedGamesCount={safePlayedGamesCount}
            sampleGamesCount={safeSampleGamesCount}
            hitsPlayedCount={safeHitsPlayedCount}
            hitsSampleCount={safeHitsSampleCount}
          />

          <SplitsPanel games={filteredGames} selectedStat={selectedStat} />

          <section className="panel-card">
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                <input
                  type="checkbox"
                  checked={includeMissedGames}
                  onChange={(e) => setIncludeMissedGames(e.target.checked)}
                  style={{ marginRight: "6px" }}
                />
                Include missed games as 0
              </label>
            </div>

            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />
            <StatChart
              games={filteredGames}
              selectedStat={selectedStat}
              mode="player"
              onSelectGame={onSelectGame}
              selectedGameId={selectedGameId}
              hitRateStat={hitRateStat}
              hitRateLine={hitRateLine}
            />
          </section>

          <HitRateBoard
            games={filteredGames}
            selectedStat={selectedStat}
            mode="player"
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
              selectedPlayerName={query}
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

export default PlayerDashboardView;
