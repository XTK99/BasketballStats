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

function isPlayedGame(game) {
  return game?.played !== false;
}

function isHomeGame(game) {
  if (typeof game?.isHome === "boolean") return game.isHome;
  return game?.location === "home";
}

function isAwayGame(game) {
  if (typeof game?.isHome === "boolean") return game.isHome === false;
  return game?.location === "away";
}

function isWinGame(game) {
  if (typeof game?.win === "boolean") return game.win;
  if (typeof game?.isWin === "boolean") return game.isWin;

  const result = String(game?.result || game?.wl || "").toLowerCase();
  return result === "win" || result === "w";
}

function isLossGame(game) {
  if (typeof game?.win === "boolean") return !game.win;
  if (typeof game?.isWin === "boolean") return !game.isWin;

  const result = String(game?.result || game?.wl || "").toLowerCase();
  return result === "loss" || result === "l";
}

function getAverageStat(games, statKey) {
  const playedGames = games.filter(isPlayedGame);
  if (!playedGames.length) return "-";

  const total = playedGames.reduce(
    (sum, game) => sum + (Number(game?.[statKey]) || 0),
    0,
  );

  return (total / playedGames.length).toFixed(1);
}

function SplitCard({ label, games, selectedStat, statLabel }) {
  const playedGames = games.filter(isPlayedGame);

  return (
    <div className="split-card">
      <div className="split-card-label">{label}</div>
      <div className="split-card-value">
        {getAverageStat(playedGames, selectedStat)} {statLabel}
      </div>
      <div className="split-card-subtext">{playedGames.length} games</div>
    </div>
  );
}

function SplitsPanel({ games = [], selectedStat = "points" }) {
  const playedGames = games.filter(isPlayedGame);
  if (!playedGames.length) return null;

  const homeGames = playedGames.filter(isHomeGame);
  const awayGames = playedGames.filter(isAwayGame);
  const winGames = playedGames.filter(isWinGame);
  const lossGames = playedGames.filter(isLossGame);

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
