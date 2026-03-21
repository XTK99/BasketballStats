import "./SplitsPanel.css";

const STAT_LABELS = {
  points: "PTS",
  rebounds: "REB",
  assists: "AST",
  steals: "STL",
  blocks: "BLK",
  turnovers: "TOV",
  minutes: "MIN",
  threesMade: "3PM",
};

function getAverageStat(games, statKey) {
  if (!games.length) return "-";

  const total = games.reduce(
    (sum, game) => sum + (Number(game?.[statKey]) || 0),
    0,
  );

  return (total / games.length).toFixed(1);
}

function SplitCard({ label, games, selectedStat, statLabel }) {
  return (
    <div className="split-card">
      <div className="split-card-label">{label}</div>
      <div className="split-card-value">
        {getAverageStat(games, selectedStat)} {statLabel}
      </div>
      <div className="split-card-subtext">{games.length} games</div>
    </div>
  );
}

function SplitsPanel({ games = [], selectedStat = "points" }) {
  if (!games.length) return null;

  const homeGames = games.filter((game) => game.location === "home");
  const awayGames = games.filter((game) => game.location === "away");

  const winGames = games.filter((game) => game.result === "win");
  const lossGames = games.filter((game) => game.result === "loss");

  const statLabel = STAT_LABELS[selectedStat] || selectedStat.toUpperCase();

  return (
    <section className="panel-card">
      <div className="splits-header">
        <h3 className="panel-title">Splits</h3>
        <span className="splits-subtitle">
          Average {statLabel} by situation
        </span>
      </div>

      <div className="splits-grid">
        <SplitCard
          label="Home"
          games={homeGames}
          selectedStat={selectedStat}
          statLabel={statLabel}
        />
        <SplitCard
          label="Away"
          games={awayGames}
          selectedStat={selectedStat}
          statLabel={statLabel}
        />
        <SplitCard
          label="Wins"
          games={winGames}
          selectedStat={selectedStat}
          statLabel={statLabel}
        />
        <SplitCard
          label="Losses"
          games={lossGames}
          selectedStat={selectedStat}
          statLabel={statLabel}
        />
      </div>
    </section>
  );
}

export default SplitsPanel;
