import { useMemo } from "react";
import "./HitRateBoard.css";

const PLAYER_THRESHOLDS = {
  points: [10, 15, 20, 25, 30, 35, 40, 45, 50],
  rebounds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  assists: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  steals: [1, 2, 3, 4, 5],
  blocks: [1, 2, 3, 4, 5],
  turnovers: [2, 3, 4, 5, 6],
  minutes: [20, 25, 30, 35, 40],
  threesMade: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

const TEAM_THRESHOLDS = {
  points: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150],
  rebounds: [35, 40, 45, 50, 55],
  assists: [20, 25, 30, 35, 40],
  steals: [5, 7, 9, 11, 13],
  blocks: [3, 5, 7, 9, 11],
  turnovers: [8, 10, 12, 14, 16],
  minutes: [220, 230, 240, 250, 260],
  threesMade: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
};

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

function getThresholdMap(mode) {
  return mode === "team" ? TEAM_THRESHOLDS : PLAYER_THRESHOLDS;
}

function getTierClass(percent) {
  if (percent >= 80) return "hit-rate-board-card-elite";
  if (percent >= 65) return "hit-rate-board-card-strong";
  if (percent >= 45) return "hit-rate-board-card-coinflip";
  if (percent >= 25) return "hit-rate-board-card-weak";
  return "hit-rate-board-card-fade";
}

function getStatValue(game, statKey) {
  const statAliases = {
    points: ["points", "PTS"],
    rebounds: ["rebounds", "REB"],
    assists: ["assists", "AST"],
    steals: ["steals", "STL"],
    blocks: ["blocks", "BLK"],
    turnovers: ["turnovers", "TOV"],
    minutes: ["minutes", "MIN"],
    threesMade: ["threesMade", "threes", "fg3m", "FG3M", "threePointersMade"],
  };

  const candidateKeys = statAliases[statKey] || [statKey];

  for (const key of candidateKeys) {
    const value = Number(game?.[key]);
    if (Number.isFinite(value)) return value;
  }

  return null;
}

function buildHitRateData(games, statKey, threshold) {
  const validValues = games
    .map((game) => getStatValue(game, statKey))
    .filter((value) => value !== null);

  const total = validValues.length;
  const hits = validValues.filter((value) => value >= threshold).length;
  const misses = total - hits;
  const hitRate = total ? (hits / total) * 100 : 0;

  const last5 = validValues.slice(0, 5);
  const last10 = validValues.slice(0, 10);

  const last5Hits = last5.filter((value) => value >= threshold).length;
  const last10Hits = last10.filter((value) => value >= threshold).length;

  return {
    threshold,
    total,
    hits,
    misses,
    hitRate,
    last5Hits,
    last5Total: last5.length,
    last10Hits,
    last10Total: last10.length,
  };
}

function HitRateBoard({
  games = [],
  mode = "player",
  selectedStat = "points",
}) {
  const thresholdMap = getThresholdMap(mode);

  const boardData = useMemo(() => {
    const thresholds = thresholdMap[selectedStat] || [];
    return thresholds.map((threshold) =>
      buildHitRateData(games, selectedStat, threshold),
    );
  }, [games, selectedStat, thresholdMap]);

  const statLabel = STAT_LABELS[selectedStat] || selectedStat;
  const title =
    mode === "team"
      ? `${statLabel} Team Hit Rate Board`
      : `${statLabel} Hit Rate Board`;

  return (
    <section className="panel-card">
      <div className="hit-rate-board-topbar">
        <div>
          <h3 className="panel-title hit-rate-board-title">{title}</h3>
          <div className="results-meta">{games.length} games</div>
        </div>
      </div>

      <div className="hit-rate-board-grid">
        {boardData.map((item) => (
          <article
            key={`${selectedStat}-${item.threshold}`}
            className={`hit-rate-board-card ${getTierClass(item.hitRate)}`}
          >
            <div className="hit-rate-board-line">
              {statLabel.toUpperCase()} {item.threshold}+
            </div>

            <div className="hit-rate-board-rate">
              {Math.round(item.hitRate)}%
            </div>

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
                  {item.last5Hits} / {item.last5Total}
                </span>
              </div>

              <div className="hit-rate-board-split">
                <span className="hit-rate-board-split-label">Last 10</span>
                <span className="hit-rate-board-split-value">
                  {item.last10Hits} / {item.last10Total}
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
