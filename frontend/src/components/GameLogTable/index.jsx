import "./GameLogTable.css";

function formatPct(value, played = true) {
  if (!played) return "—";

  const num = Number(value);
  if (!Number.isFinite(num)) return "0.0";

  return num <= 1 ? (num * 100).toFixed(1) : num.toFixed(1);
}

function formatStat(value, played = true) {
  if (!played) return "—";

  if (value === null || value === undefined || value === "") {
    return "0";
  }

  return value;
}

function formatResult(game) {
  if (game?.wl) return game.wl;
  if (game?.result === "win") return "W";
  if (game?.result === "loss") return "L";
  return "";
}

function GameLogTable({ games = [], onSelectGame, selectedGameId }) {
  if (!Array.isArray(games) || games.length === 0) return null;

  function handleSelect(game) {
    onSelectGame?.(game);
  }

  return (
    <section className="panel-card">
      <div className="table-header">
        <div>
          <h3 className="panel-title">Match History</h3>
          <p className="table-subtitle">
            {games.length} games • Click a matchup to load the box score
          </p>
        </div>
      </div>

      <div className="table-scroll">
        <table className="game-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>MATCHUP</th>
              <th>RESULT</th>

              <th>MIN</th>
              <th>PTS</th>
              <th>REB</th>
              <th>AST</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TOV</th>
              <th>FGM</th>
              <th>FGA</th>
              <th>FG%</th>
              <th>3PM</th>
              <th>3PA</th>
              <th>3P%</th>
              <th>FTM</th>
              <th>FTA</th>
              <th>FT%</th>
            </tr>
          </thead>

          <tbody>
            {games.map((game, index) => {
              const isSelected = selectedGameId === game.gameId;
              const played = game?.played !== false;
              const result = formatResult(game);

              return (
                <tr
                  key={game.gameId || `${game.gameDate}-${index}`}
                  className={[
                    isSelected ? "game-row-selected" : "",
                    !played ? "game-row-missed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSelect(game)}
                >
                  <td>{game.gameDate || "—"}</td>

                  <td>
                    <button
                      type="button"
                      className="matchup-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelect(game);
                      }}
                    >
                      {game.matchup || "—"}
                    </button>
                  </td>

                  <td>
                    {result ? (
                      <span
                        className={`result-pill ${
                          result === "W" ? "result-win" : "result-loss"
                        }`}
                      >
                        {result}
                      </span>
                    ) : (
                      <span className="muted-cell">{played ? "—" : "DNP"}</span>
                    )}
                  </td>

                  <td>{formatStat(game.minutes, played)}</td>
                  <td>{formatStat(game.points, played)}</td>
                  <td>{formatStat(game.rebounds, played)}</td>
                  <td>{formatStat(game.assists, played)}</td>
                  <td>{formatStat(game.steals, played)}</td>
                  <td>{formatStat(game.blocks, played)}</td>
                  <td>{formatStat(game.turnovers, played)}</td>
                  <td>{formatStat(game.fgm, played)}</td>
                  <td>{formatStat(game.fga, played)}</td>
                  <td>{formatPct(game.fgPct, played)}</td>
                  <td>{formatStat(game.fg3m, played)}</td>
                  <td>{formatStat(game.fg3a, played)}</td>
                  <td>{formatPct(game.fg3Pct, played)}</td>
                  <td>{formatStat(game.ftm, played)}</td>
                  <td>{formatStat(game.fta, played)}</td>
                  <td>{formatPct(game.ftPct, played)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GameLogTable;
