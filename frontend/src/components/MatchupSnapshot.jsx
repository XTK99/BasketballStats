function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.0";
  return num.toFixed(1);
}

function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0%";
  const prefix = num > 0 ? "+" : "";
  return `${prefix}${num.toFixed(1)}%`;
}

function formatEdgeValue(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.0";
  const prefix = num > 0 ? "+" : "";
  return `${prefix}${num.toFixed(1)}`;
}

function MatchupSnapshot({
  title = "Matchup Snapshot",
  opponent = "",
  statLabel = "",
  snapshot,
}) {
  if (!snapshot) return null;

  return (
    <section
      className={`panel-card matchup-snapshot-card matchup-edge-${snapshot.edgeTone}`}
    >
      <div className="matchup-snapshot-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          <p className="matchup-snapshot-subtitle">
            {opponent || snapshot.opponent || "All Opponents"}
          </p>
        </div>
        <div className="matchup-snapshot-header-right">
          <span
            className={`matchup-snapshot-confidence-badge confidence-${snapshot.confidenceTone}`}
          >
            {snapshot.confidenceLabel}
          </span>

          <span className="matchup-snapshot-edge-badge">
            {snapshot.edgeLabel}
          </span>

          <span className="matchup-snapshot-badge">
            {snapshot.gamesCount} game{snapshot.gamesCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="matchup-snapshot-grid">
        <div className="matchup-snapshot-item">
          <span className="matchup-snapshot-label">Overall {statLabel}</span>
          <span className="matchup-snapshot-value">
            {formatNumber(snapshot.overallAverage)}
          </span>
        </div>

        <div className="matchup-snapshot-item">
          <span className="matchup-snapshot-label">Vs Opponent</span>
          <span className="matchup-snapshot-value">
            {formatNumber(snapshot.average)}
          </span>
        </div>

        <div className="matchup-snapshot-item">
          <span className="matchup-snapshot-label">Matchup Edge</span>
          <span className="matchup-snapshot-value">
            {formatEdgeValue(snapshot.edgeValue)}
          </span>
          <span className="matchup-snapshot-meta">
            {formatPercent(snapshot.edgePercent)} vs overall
          </span>
        </div>

        <div className="matchup-snapshot-item">
          <span className="matchup-snapshot-label">Last Matchup</span>
          <span className="matchup-snapshot-value">
            {snapshot.lastMatchupValue === null
              ? "—"
              : formatNumber(snapshot.lastMatchupValue)}
          </span>
          <span className="matchup-snapshot-meta">
            {snapshot.lastMatchupDate || "No recent game"}
          </span>
        </div>

        <div className="matchup-snapshot-item">
          <span className="matchup-snapshot-label">Hit Rate</span>
          <span className="matchup-snapshot-value">
            {snapshot.hasLine ? `${Math.round(snapshot.hitRate)}%` : "—"}
          </span>
          <span className="matchup-snapshot-meta">
            {snapshot.hasLine
              ? `${snapshot.hits} / ${snapshot.total}`
              : "No active line"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default MatchupSnapshot;
