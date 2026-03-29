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

function formatStatLabel(stat) {
  const text = String(stat || "").trim();
  if (!text) return "Stat";

  const labels = {
    points: "Points",
    rebounds: "Rebounds",
    assists: "Assists",
    steals: "Steals",
    blocks: "Blocks",
    turnovers: "Turnovers",
    threes: "3PM",
    threepm: "3PM",
    "3pm": "3PM",
    minutes: "Minutes",
  };

  return (
    labels[text.toLowerCase()] || text.charAt(0).toUpperCase() + text.slice(1)
  );
}

function PropEdgeCard({
  title,
  selectedStat,
  selectedLine,
  insights,
  playedGamesCount = 0,
  sampleGamesCount = 0,
  hitsPlayedCount = 0,
  hitsSampleCount = 0,
}) {
  if (!insights) return null;

  const statLabel = formatStatLabel(selectedStat);

  const safePlayedGamesCount = Number.isFinite(playedGamesCount)
    ? playedGamesCount
    : 0;

  const safeSampleGamesCount = Number.isFinite(sampleGamesCount)
    ? sampleGamesCount
    : 0;

  const safeHitsPlayedCount = Number.isFinite(hitsPlayedCount)
    ? hitsPlayedCount
    : 0;

  const safeHitsSampleCount = Number.isFinite(hitsSampleCount)
    ? hitsSampleCount
    : 0;

  const playedHitRate =
    safePlayedGamesCount > 0
      ? (safeHitsPlayedCount / safePlayedGamesCount) * 100
      : 0;

  return (
    <section className="panel-card prop-edge-card">
      <div className="prop-edge-header">
        <div>
          <h3 className="panel-title">Prop Edge</h3>
          <p className="prop-edge-subtitle">
            {title} • Over{" "}
            {Number.isFinite(Number(selectedLine))
              ? selectedLine
              : insights.line}{" "}gg
            {statLabel}
          </p>
        </div>

        <span className="prop-edge-badge">
          Sample: {playedGamesCount} games
        </span>
      </div>

      <div className="prop-edge-grid">
        <div className="prop-edge-item">
          <span className="prop-edge-label">Hit Rate</span>
          <span className="prop-edge-value">
            {formatPercent(playedHitRate)}
          </span>
          <span className="prop-edge-meta">
            {safeHitsPlayedCount} / {safePlayedGamesCount} played
          </span>
          <span className="prop-edge-meta">
            {safeHitsSampleCount} / {safeSampleGamesCount} season
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
            {insights.last5?.hits ?? 0} / {insights.last5?.games ?? 0}
          </span>
          <span className="prop-edge-meta">
            {formatPercent(insights.last5?.hitRate ?? 0)}
          </span>
        </div>

        <div className="prop-edge-item">
          <span className="prop-edge-label">Last 10</span>
          <span className="prop-edge-value">
            {insights.last10?.hits ?? 0} / {insights.last10?.games ?? 0}
          </span>
          <span className="prop-edge-meta">
            {formatPercent(insights.last10?.hitRate ?? 0)}
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
