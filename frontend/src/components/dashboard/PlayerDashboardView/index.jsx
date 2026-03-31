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
import "./PlayerDashboardView.css";

function toSafeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function PlayerDashboardView({ dashboard, controls, boxScoreState }) {
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
    includeMissedGames,
    setIncludeMissedGames,
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

  const games = dashboard?.games ?? [];
  const filteredGames = dashboard?.filteredGames ?? [];
  const filteredPlayedGames =
    dashboard?.filteredPlayedGames ??
    filteredGames.filter((game) => game?.played !== false);

  const chartData = dashboard?.chartData ?? [];
  const splits = dashboard?.splits ?? {};
  const summary = dashboard?.summary ?? {};
  const averages = summary?.averages ?? {};
  const hitRateBoard = dashboard?.hitRateBoard ?? [];
  const selectedLine = dashboard?.selectedLine ?? null;
  const propInsights = dashboard?.propInsights ?? null;

  const loadedGames = toSafeNumber(summary.loadedGames, games.length);
  const filteredCount = toSafeNumber(
    summary.filteredCount,
    filteredGames.length,
  );
  const playedGamesCount = toSafeNumber(summary.playedCount, 0);
  const filteredPlayedGamesCount = toSafeNumber(
    summary.filteredPlayedCount,
    filteredPlayedGames.length,
  );
  const filteredPercent = summary.filteredPercent ?? "0.0";

  const seasonMissedCount = Math.max(0, loadedGames - playedGamesCount);

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
                <span className="games-played-value">{playedGamesCount}</span>
                <span className="games-played-divider">/</span>
                <span className="games-sample-value">{loadedGames}</span>
              </div>
              <div className="games-played-label">Played</div>
            </div>

            <div className="games-played-chip missed-chip">
              <div className="games-played-main">
                <span className="games-played-value">{seasonMissedCount}</span>
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

            <div className="panel-title" style={{ marginBottom: "12px" }}>
              Dashboard Snapshot
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
              }}
            >
              <div className="summary-card">
                <div className="summary-label">Loaded Games</div>
                <div className="summary-value">{loadedGames}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Filtered Games</div>
                <div className="summary-value">{filteredCount}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Played Games</div>
                <div className="summary-value">{playedGamesCount}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Filtered Played</div>
                <div className="summary-value">{filteredPlayedGamesCount}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Filtered %</div>
                <div className="summary-value">{filteredPercent}%</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Selected Stat</div>
                <div className="summary-value" style={{ fontSize: "1rem" }}>
                  {selectedStat}
                </div>
              </div>
            </div>
          </section>

          <PropEdgeCard
            title={title}
            selectedStat={selectedStat}
            selectedLine={selectedLine}
            insights={propInsights}
          />

          <SplitsPanel
            games={filteredPlayedGames}
            selectedStat={selectedStat}
          />

          <section className="panel-card">
            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />

            <StatChart
              data={chartData}
              games={
                includeMissedGames
                  ? (dashboard?.filteredGames ?? [])
                  : (dashboard?.filteredPlayedGames ?? [])
              }
              selectedStat={selectedStat}
              mode="player"
              onSelectGame={onSelectGame}
              selectedGameId={selectedGameId}
            />
          </section>

          <HitRateBoard
            board={hitRateBoard}
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
        </>
      )}

      <GameLogTable
        games={filteredPlayedGames}
        onSelectGame={onSelectGame}
        selectedGameId={selectedGameId}
      />
    </div>
  );
}

export default PlayerDashboardView;
