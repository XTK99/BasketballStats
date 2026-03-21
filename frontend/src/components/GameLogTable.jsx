import "./GameLogTable.css";

function formatPct(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "0.0";
  return num <= 1 ? (num * 100).toFixed(1) : num.toFixed(1);
}

function GameLogTable({ games, onSelectGame, selectedGameId }) {
  if (!games || games.length === 0) return null;

  function handleSelect(game) {
    onSelectGame?.(game);
  }

  return (
    <section className="panel-card">
      <div className="table-header">
        <div>
          <h3 className="panel-title">Game Log</h3>
          <p className="table-subtitle">
            Click a matchup to load the box score
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

              return (
                <tr
                  key={game.gameId || index}
                  className={isSelected ? "game-row-selected" : ""}
                  onClick={() => handleSelect(game)}
                >
                  <td>{game.gameDate}</td>

                  <td>
                    <button
                      type="button"
                      className="matchup-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelect(game);
                      }}
                    >
                      {game.matchup}
                    </button>
                  </td>

                  <td>
                    {game.wl ? (
                      <span
                        className={`result-pill ${
                          game.wl === "W" ? "result-win" : "result-loss"
                        }`}
                      >
                        {game.wl}
                      </span>
                    ) : null}
                  </td>

                  <td>{game.minutes}</td>
                  <td>{game.points}</td>
                  <td>{game.rebounds}</td>
                  <td>{game.assists}</td>
                  <td>{game.steals}</td>
                  <td>{game.blocks}</td>
                  <td>{game.turnovers}</td>
                  <td>{game.fgm}</td>
                  <td>{game.fga}</td>
                  <td>{formatPct(game.fgPct)}</td>
                  <td>{game.fg3m}</td>
                  <td>{game.fg3a}</td>
                  <td>{formatPct(game.fg3Pct)}</td>
                  <td>{game.ftm}</td>
                  <td>{game.fta}</td>
                  <td>{formatPct(game.ftPct)}</td>
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
