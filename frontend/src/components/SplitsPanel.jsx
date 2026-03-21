import "./SplitsPanel.css";

function getAveragePoints(games) {
  if (!games.length) return "-";

  const total = games.reduce((sum, game) => sum + (game.points || 0), 0);
  return (total / games.length).toFixed(1);
}

function SplitCard({ label, games }) {
  return (
    <div className="split-card">
      <div className="split-card-label">{label}</div>
      <div className="split-card-value">{getAveragePoints(games)} PTS</div>
      <div className="split-card-subtext">{games.length} games</div>
    </div>
  );
}

function SplitsPanel({ games }) {
  if (!games || games.length === 0) return null;

  const homeGames = games.filter((game) => game.matchup?.includes("vs."));
  const awayGames = games.filter((game) => game.matchup?.includes("@"));

  const winGames = games.filter((game) => game.wl === "W");
  const lossGames = games.filter((game) => game.wl === "L");

  return (
    <section className="panel-card">
      <div className="splits-header">
        <h3 className="panel-title">Splits</h3>
        <span className="splits-subtitle">Average points by situation</span>
      </div>

      <div className="splits-grid">
        <SplitCard label="Home" games={homeGames} />
        <SplitCard label="Away" games={awayGames} />
        <SplitCard label="Wins" games={winGames} />
        <SplitCard label="Losses" games={lossGames} />
      </div>
    </section>
  );
}

export default SplitsPanel;
