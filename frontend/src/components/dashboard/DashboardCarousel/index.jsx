import "./DashboardCarousel.css";

function DashboardCarousel({
  activeDashboardView,
  setActiveDashboardView,
  playerView,
  teamView,
}) {
  const activeView = activeDashboardView === "team" ? "team" : "player";

  return (
    <section className="dashboard-carousel-shell">
      <div className="dashboard-carousel-content">
        {activeView === "player" ? playerView : teamView}
      </div>
    </section>
  );
}

export default DashboardCarousel;
