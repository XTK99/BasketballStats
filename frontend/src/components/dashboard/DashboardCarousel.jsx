import "./DashboardCarousel.css";

function DashboardCarousel({
  activeDashboardView,
  setActiveDashboardView,
  playerView,
  teamView,
}) {
  const views = [
    { key: "player", label: "Player", content: playerView },
    { key: "team", label: "Team", content: teamView },
  ];

  function goToPreviousDashboard() {
    const currentIndex = views.findIndex(
      (view) => view.key === activeDashboardView,
    );
    const nextIndex = currentIndex === 0 ? views.length - 1 : currentIndex - 1;
    setActiveDashboardView(views[nextIndex].key);
  }

  function goToNextDashboard() {
    const currentIndex = views.findIndex(
      (view) => view.key === activeDashboardView,
    );
    const nextIndex = currentIndex === views.length - 1 ? 0 : currentIndex + 1;
    setActiveDashboardView(views[nextIndex].key);
  }

  const activeView =
    views.find((view) => view.key === activeDashboardView) || views[0];

  return (
    <>
      <div className="dashboard-view-indicators">
        {views.map((view) => (
          <button
            key={view.key}
            type="button"
            className={`dashboard-view-dot ${
              activeDashboardView === view.key ? "active" : ""
            }`}
            onClick={() => setActiveDashboardView(view.key)}
          >
            {view.label}
          </button>
        ))}
      </div>

      <section className="dashboard-carousel-shell">
        <button
          type="button"
          className="dashboard-swap-zone dashboard-swap-zone-left"
          onClick={goToPreviousDashboard}
          aria-label="Show previous dashboard"
          title="Previous dashboard"
        >
          <span className="dashboard-swap-arrow">‹</span>
        </button>

        <div className="dashboard-carousel-content">{activeView.content}</div>

        <button
          type="button"
          className="dashboard-swap-zone dashboard-swap-zone-right"
          onClick={goToNextDashboard}
          aria-label="Show next dashboard"
          title="Next dashboard"
        >
          <span className="dashboard-swap-arrow">›</span>
        </button>
      </section>
    </>
  );
}

export default DashboardCarousel;
