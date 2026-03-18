function SplitCard({ title, split }) {
  return (
    <div className="split-card">
      <div className="split-card-header">
        <span className="split-card-title">{title}</span>
        <span className="split-card-count">{split.gameCount} games</span>
      </div>

      <div className="split-card-grid">
        <div className="split-stat">
          <span className="split-stat-label">PTS</span>
          <span className="split-stat-value">{split.points}</span>
        </div>
        <div className="split-stat">
          <span className="split-stat-label">REB</span>
          <span className="split-stat-value">{split.rebounds}</span>
        </div>
        <div className="split-stat">
          <span className="split-stat-label">AST</span>
          <span className="split-stat-value">{split.assists}</span>
        </div>
        <div className="split-stat">
          <span className="split-stat-label">STL</span>
          <span className="split-stat-value">{split.steals}</span>
        </div>
        <div className="split-stat">
          <span className="split-stat-label">BLK</span>
          <span className="split-stat-value">{split.blocks}</span>
        </div>
        <div className="split-stat">
          <span className="split-stat-label">TOV</span>
          <span className="split-stat-value">{split.turnovers}</span>
        </div>
        <div className="split-stat">
          <span className="split-stat-label">MIN</span>
          <span className="split-stat-value">{split.minutes}</span>
        </div>
      </div>
    </div>
  );
}

function SplitsPanel({ splits }) {
  if (!splits) return null;

  return (
    <section className="panel-card">
      <h3 className="panel-title">Splits</h3>

      <div className="splits-grid">
        <SplitCard title="Home" split={splits.home} />
        <SplitCard title="Away" split={splits.away} />
        <SplitCard title="Wins" split={splits.wins} />
        <SplitCard title="Losses" split={splits.losses} />
      </div>
    </section>
  );
}

export default SplitsPanel;
