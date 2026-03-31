import "./HitRateBoard.css";

const STAT_LABELS = {
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",
  minutes: "Minutes",
  threesMade: "3PM",
};

function getTierClass(percent) {
  if (percent >= 80) return "hit-rate-board-card-elite";
  if (percent >= 65) return "hit-rate-board-card-strong";
  if (percent >= 45) return "hit-rate-board-card-coinflip";
  if (percent >= 25) return "hit-rate-board-card-weak";
  return "hit-rate-board-card-fade";
}

function HitRateBoard({
  board = [],
  mode = "player",
  selectedStat = "points",
}) {
  const statLabel = STAT_LABELS[selectedStat] || selectedStat;

  const title =
    mode === "team"
      ? `${statLabel} Team Hit Rate Board`
      : `${statLabel} Hit Rate Board`;

  const totalGames = board.length > 0 ? board[0].total : 0;

  return (
    <section className="panel-card">
      <div className="hit-rate-board-topbar">
        <div>
          <h3 className="panel-title hit-rate-board-title">{title}</h3>
          <div className="results-meta">{totalGames} games</div>
        </div>
      </div>

      <div className="hit-rate-board-grid">
        {board.map((item) => (
          <article
            key={`${selectedStat}-${item.line}`}
            className={`hit-rate-board-card ${getTierClass(item.percentage)}`}
          >
            <div className="hit-rate-board-line">
              {statLabel.toUpperCase()} {item.line}+
            </div>

            <div className="hit-rate-board-rate">{item.percentage}%</div>

            <div className="hit-rate-board-detail">
              {item.hits} / {item.total}
            </div>

            <div className="hit-rate-board-subdetail">
              Misses: {item.misses}
            </div>

            <div className="hit-rate-board-splits">
              <div className="hit-rate-board-split">
                <span className="hit-rate-board-split-label">Last 5</span>
                <span className="hit-rate-board-split-value">
                  {item.last5.hits} / {item.last5.total}
                </span>
              </div>

              <div className="hit-rate-board-split">
                <span className="hit-rate-board-split-label">Last 10</span>
                <span className="hit-rate-board-split-value">
                  {item.last10.hits} / {item.last10.total}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HitRateBoard;
