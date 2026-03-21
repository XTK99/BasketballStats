function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.0";
  return num.toFixed(1);
}

function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0%";
  return `${Math.round(num)}%`;
}

function formatSplit(split) {
  if (!split || !split.games) return "—";
  return `${split.label}: ${split.hits} / ${split.games}`;
}

function PropEdgeCard({ title, statLabel, insights }) {
  if (!insights) return null;

  return (
    <section className="panel-card prop-edge-card">
      <div className="prop-edge-header">
        <div>
          <h3 className="panel-title">Prop Edge</h3>
          <p className="prop-edge-subtitle">
            {title} • Over {insights.line} {statLabel}
          </p>
        </div>

        <span className="prop-edge-badge">
          Sample: {insights.totalGames} games
        </span>
      </div>

      <div className="prop-edge-grid">
        <div className="prop-edge-item">
          <span className="prop-edge-label">Hit Rate</span>
          <span className="prop-edge-value">
            {formatPercent(insights.hitRate)}
          </span>
          <span className="prop-edge-meta">
            {insights.totalHits} / {insights.totalGames}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Average</span>
          <span className="prop-edge-value">
            {formatNumber(insights.average)}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Median</span>
          <span className="prop-edge-value">
            {formatNumber(insights.median)}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Last 5</span>
          <span className="prop-edge-value">
            {insights.last5.hits} / {insights.last5.games}
          </span>
          <span className="prop-edge-meta">
            {formatPercent(insights.last5.hitRate)}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Last 10</span>
          <span className="prop-edge-value">
            {insights.last10.hits} / {insights.last10.games}
          </span>
          <span className="prop-edge-meta">
            {formatPercent(insights.last10.hitRate)}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Best Split</span>
          <span className="prop-edge-value prop-edge-split">
            {formatSplit(insights.bestSplit)}
          </span>
          <span className="prop-edge-meta">
            {insights.bestSplit
              ? formatPercent(insights.bestSplit.hitRate)
              : "—"}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Worst Split</span>
          <span className="prop-edge-value prop-edge-split">
            {formatSplit(insights.worstSplit)}
          </span>
          <span className="prop-edge-meta">
            {insights.worstSplit
              ? formatPercent(insights.worstSplit.hitRate)
              : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default PropEdgeCard;
