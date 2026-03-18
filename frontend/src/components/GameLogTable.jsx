function formatPct(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "0.0";
  return num <= 1 ? (num * 100).toFixed(1) : num.toFixed(1);
}

function GameLogTable({ games, onSelectGame }) {
  if (!games || games.length === 0) return null;

  return (
    <section className="table-card">
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
            {games.map((game, index) => (
              <tr key={game.gameId || index}>
                <td>{game.gameDate}</td>

                <td>
                  <button
                    type="button"
                    className="matchup-link"
                    onClick={() => onSelectGame?.(game)}
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
                  ) : (
                    ""
                  )}
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GameLogTable;
