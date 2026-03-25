import DashboardHeaderCard from "./DashboardHeaderCard";
import DashboardFilterSection from "./DashboardFilterSection";
import SearchBar from "../SearchBar";
import SummaryCards from "../SummaryCards";
import BoxScorePanel from "../BoxScorePanel";
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
  const summary = dashboard?.summary ?? {};
  const averages = dashboard?.averages ?? summary?.averages ?? {};

  const loadedGames = toSafeNumber(summary.loadedGames, games.length);
  const filteredCount = toSafeNumber(
    summary.filteredCount,
    filteredGames.length,
  );
  const playedGamesCount = toSafeNumber(summary.playedCount, 0);
  const filteredPlayedGamesCount = toSafeNumber(summary.filteredPlayedCount, 0);
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

          <section className="panel-card">
            <div className="panel-title" style={{ marginBottom: "12px" }}>
              Games
            </div>

            {filteredGames.length === 0 ? (
              <p className="status-message">No games to display.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Matchup</th>
                      <th style={thStyle}>Result</th>
                      <th style={thStyle}>PTS</th>
                      <th style={thStyle}>REB</th>
                      <th style={thStyle}>AST</th>
                      <th style={thStyle}>MIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGames.slice(0, 25).map((game) => {
                      const isSelected = selectedGameId === game.gameId;

                      return (
                        <tr
                          key={game.gameId}
                          onClick={() => onSelectGame?.(game)}
                          style={{
                            cursor: "pointer",
                            background: isSelected
                              ? "rgba(59, 130, 246, 0.12)"
                              : "transparent",
                          }}
                        >
                          <td style={tdStyle}>{game.gameDate || "—"}</td>
                          <td style={tdStyle}>{game.matchup || "—"}</td>
                          <td style={tdStyle}>
                            {game.result || game.wl || "—"}
                          </td>
                          <td style={tdStyle}>
                            {toSafeNumber(game.points, 0)}
                          </td>
                          <td style={tdStyle}>
                            {toSafeNumber(game.rebounds, 0)}
                          </td>
                          <td style={tdStyle}>
                            {toSafeNumber(game.assists, 0)}
                          </td>
                          <td style={tdStyle}>
                            {toSafeNumber(game.minutes, 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

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
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

export default PlayerDashboardView;
