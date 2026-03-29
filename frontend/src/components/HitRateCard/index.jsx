function HitRateCard({
  hitRateStat,
  setHitRateStat,
  hitRateType,
  setHitRateType,
  hitRateLine,
  setHitRateLine,
  hitRateData,
}) {
  return (
    <section className="panel-card">
      <h3 className="panel-title">Over / Under Hit Rate</h3>

      <div className="hit-rate-controls">
        <select
          className="threshold-control"
          value={hitRateStat}
          onChange={(e) => setHitRateStat(e.target.value)}
        >
          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="assists">Assists</option>
          <option value="steals">Steals</option>
          <option value="blocks">Blocks</option>
          <option value="turnovers">Turnovers</option>
          <option value="FGM">FGM</option>
          <option value="FGA">FGA</option>
          <option value="3PM">3PM</option>
          <option value="3PA">3PA</option>
        </select>

        <select
          className="threshold-control"
          value={hitRateType}
          onChange={(e) => setHitRateType(e.target.value)}
        >
          <option value="over">Over</option>
          <option value="under">Under</option>
        </select>

        <input
          className="threshold-control threshold-input"
          type="text"
          inputMode="decimal"
          value={hitRateLine}
          onChange={(e) =>
            setHitRateLine(e.target.value.replace(/[^\d.]/g, ""))
          }
          placeholder="Line"
        />
      </div>

      <div className="hit-rate-results">
        <div className="results-stat-card">
          <span className="results-stat-label">Hit Rate</span>
          <span className="results-stat-value">
            {hitRateData.hits} / {hitRateData.total}
          </span>
          <span className="results-stat-subvalue">
            {hitRateData.percentage}%
          </span>
        </div>

        <div className="results-stat-card">
          <span className="results-stat-label">Misses</span>
          <span className="results-stat-value">{hitRateData.misses}</span>
        </div>

        <div className="results-stat-card">
          <span className="results-stat-label">Pushes</span>
          <span className="results-stat-value">{hitRateData.pushes}</span>
        </div>

        <div className="results-stat-card">
          <span className="results-stat-label">Average</span>
          <span className="results-stat-value">{hitRateData.average}</span>
        </div>
      </div>
    </section>
  );
}

export default HitRateCard;
