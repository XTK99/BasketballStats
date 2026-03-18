function formatStatLabel(stat) {
  const labels = {
    points: "Points",
    rebounds: "Rebounds",
    assists: "Assists",
    steals: "Steals",
    blocks: "Blocks",
    turnovers: "Turnovers",
    FGM: "FGM",
    FGA: "FGA",
    "3PM": "3PM",
    "3PA": "3PA",
    FTM: "FTM",
    FTA: "FTA",
  };

  return labels[stat] || stat;
}

function getHitRateTier(percentage) {
  if (percentage >= 70) return "strong";
  if (percentage >= 40) return "medium";
  return "weak";
}

function HitRateBoard({ title, season, stat, setStat, boardData, gameCount }) {
  return (
    <section className="panel-card">
      <div className="hit-rate-board-topbar">
        <div className="hit-rate-board-header">
          <h3 className="panel-title hit-rate-board-title">
            {formatStatLabel(stat)} Hit Rate Board
          </h3>
          <p className="results-meta">
            {title} • Season {season} • {gameCount} games
          </p>
        </div>

        <div className="hit-rate-board-controls">
          <label className="hit-rate-board-select-label" htmlFor="board-stat">
            Stat
          </label>
          <select
            id="board-stat"
            className="hit-rate-board-select"
            value={stat}
            onChange={(e) => setStat(e.target.value)}
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
        </div>
      </div>

      <div className="hit-rate-board-grid">
        {boardData.map((item) => {
          const tier = getHitRateTier(item.percentage);

          return (
            <div
              key={item.line}
              className={`hit-rate-board-card hit-rate-board-card-${tier}`}
            >
              <div className="hit-rate-board-line">
                {formatStatLabel(stat).toUpperCase()} {item.line}+
              </div>

              <div className="hit-rate-board-rate">{item.percentage}%</div>

              <div className="hit-rate-board-detail">
                {item.hits} / {item.total}
              </div>

              <div className="hit-rate-board-subdetail">
                Misses: {item.misses}
                {item.pushes > 0 ? ` • Pushes: ${item.pushes}` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HitRateBoard;
