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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveDashboardView("player")}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border:
              activeView === "player"
                ? "1px solid rgba(96, 165, 250, 0.9)"
                : "1px solid rgba(255,255,255,0.16)",
            background:
              activeView === "player"
                ? "rgba(59, 130, 246, 0.18)"
                : "rgba(255,255,255,0.04)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Player
        </button>

        <button
          type="button"
          onClick={() => setActiveDashboardView("team")}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border:
              activeView === "team"
                ? "1px solid rgba(96, 165, 250, 0.9)"
                : "1px solid rgba(255,255,255,0.16)",
            background:
              activeView === "team"
                ? "rgba(59, 130, 246, 0.18)"
                : "rgba(255,255,255,0.04)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Team
        </button>
      </div>

      <div className="dashboard-carousel-content">
        {activeView === "player" ? playerView : teamView}
      </div>
    </section>
  );
}

export default DashboardCarousel;
