function AppHeader({
  viewMode,
  setViewMode,
  activeDashboardView,
  setActiveDashboardView,
}) {
  return (
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
  );
}

export default AppHeader;
