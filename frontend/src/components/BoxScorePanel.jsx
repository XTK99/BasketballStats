function formatPct(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "0.0";
  return num <= 1 ? (num * 100).toFixed(1) : num.toFixed(1);
}

function BoxScorePanel({ boxScore }) {
  const teams = boxScore?.teams || [];
  const players = boxScore?.players || [];

  return (
    <div className="boxscore-panel">
      {teams.map((team, index) => {
        const teamPlayers = players.filter(
          (player) => player.TEAM_ID === team.TEAM_ID,
        );

        const teamClass = index === 0 ? "team-card-away" : "team-card-home";

        return (
          <section
            key={team.TEAM_ID}
            className={`boxscore-team-card ${teamClass}`}
          >
            <div className="boxscore-team-header">
              <div className="boxscore-team-title-row">
                <h4 className="boxscore-team-title">
                  {team.TEAM_CITY} {team.TEAM_NAME}
                </h4>
                <span className="boxscore-team-code">
                  {team.TEAM_ABBREVIATION}
                </span>
              </div>

              <div className="boxscore-team-stats-grid">
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">PTS</span>
                  <span className="boxscore-stat-value">{team.PTS}</span>
                </div>
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">REB</span>
                  <span className="boxscore-stat-value">{team.REB}</span>
                </div>
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">AST</span>
                  <span className="boxscore-stat-value">{team.AST}</span>
                </div>
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">FG%</span>
                  <span className="boxscore-stat-value">
                    {formatPct(team.FG_PCT)}
                  </span>
                </div>
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">3P%</span>
                  <span className="boxscore-stat-value">
                    {formatPct(team.FG3_PCT)}
                  </span>
                </div>
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">FT%</span>
                  <span className="boxscore-stat-value">
                    {formatPct(team.FT_PCT)}
                  </span>
                </div>
              </div>
            </div>

            <div className="table-scroll">
              <table className="game-table">
                <thead>
                  <tr>
                    <th>PLAYER</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>STL</th>
                    <th>BLK</th>
                    <th>FGM</th>
                    <th>FGA</th>
                    <th>FG%</th>
                    <th>3PM</th>
                    <th>3PA</th>
                    <th>3P%</th>
                    <th>FTM</th>
                    <th>FTA</th>
                    <th>FT%</th>
                    <th>TOV</th>
                    <th>+/-</th>
                  </tr>
                </thead>

                <tbody>
                  {teamPlayers.map((player) => (
                    <tr key={`${team.TEAM_ID}-${player.PLAYER_ID}`}>
                      <td className="boxscore-player-cell">
                        <span className="boxscore-player-name">
                          {player.PLAYER_NAME}
                        </span>
                        {player.COMMENT ? (
                          <span className="boxscore-player-comment">
                            {player.COMMENT}
                          </span>
                        ) : null}
                      </td>
                      <td>{player.MIN || "0"}</td>
                      <td>{player.PTS}</td>
                      <td>{player.REB}</td>
                      <td>{player.AST}</td>
                      <td>{player.STL}</td>
                      <td>{player.BLK}</td>
                      <td>{player.FGM}</td>
                      <td>{player.FGA}</td>
                      <td>{formatPct(player.FG_PCT)}</td>
                      <td>{player.FG3M}</td>
                      <td>{player.FG3A}</td>
                      <td>{formatPct(player.FG3_PCT)}</td>
                      <td>{player.FTM}</td>
                      <td>{player.FTA}</td>
                      <td>{formatPct(player.FT_PCT)}</td>
                      <td>{player.TOV}</td>
                      <td>{player.PLUS_MINUS}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default BoxScorePanel;
