function GameLogTable({ games }) {
  if (!games || games.length === 0) return null;

  return (
    <section className="table-card">
      <div className="table-scroll">
        <table className="game-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Matchup</th>
              <th>Result</th>
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
            {games.map((game) => (
              <tr key={game.gameId}>
                <td>{game.date}</td>
                <td>{game.matchup}</td>
                <td>
                  <span
                    className={`result-pill ${
                      game.result === "W" ? "result-win" : "result-loss"
                    }`}
                  >
                    {game.result}
                  </span>
                </td>
                <td>{game.points}</td>
                <td>{game.rebounds}</td>
                <td>{game.assists}</td>
                <td>{game.steals}</td>
                <td>{game.blocks}</td>
                <td>{game.turnovers}</td>
                <td>{game.fieldGoalsMade}</td>
                <td>{game.fieldGoalsAttempted}</td>
                <td>{game.fieldGoalPct}</td>
                <td>{game.threesMade}</td>
                <td>{game.threesAttempted}</td>
                <td>{game.threePointPct}</td>
                <td>{game.freeThrowsMade}</td>
                <td>{game.freeThrowsAttempted}</td>
                <td>{game.freeThrowPct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GameLogTable;
