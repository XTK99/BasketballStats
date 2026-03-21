import "./BoxScorePanel.css";

function formatPct(value) {
  const num = Number(value);

  if (!Number.isFinite(num)) return "—";
  if (num === 0) return "0.0";

  return num <= 1 ? (num * 100).toFixed(1) : num.toFixed(1);
}

function formatStat(value, fallback = "0") {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

function getDisplayValue(player, value, fallback = "0") {
  const didNotPlay = Boolean(player?.COMMENT);
  if (didNotPlay) return "—";
  return formatStat(value, fallback);
}

function getDisplayPct(player, value) {
  const didNotPlay = Boolean(player?.COMMENT);
  if (didNotPlay) return "—";
  return formatPct(value);
}

function slugTeamName(team) {
  return `${team?.TEAM_CITY || ""}-${team?.TEAM_NAME || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function isPlayerMatch(playerName, selectedPlayerName) {
  const normalizedPlayer = normalizeName(playerName);
  const normalizedSearch = normalizeName(selectedPlayerName);

  if (!normalizedSearch) return false;

  return normalizedPlayer.includes(normalizedSearch);
}

function BoxScorePanel({
  boxScore,
  loading = false,
  error = "",
  selectedPlayerName = "",
}) {
  if (loading) {
    return (
      <section className="panel-card">
        <h3 className="panel-title">Box Score</h3>
        <p className="empty-state">Loading box score...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-card">
        <h3 className="panel-title">Box Score</h3>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  const teams = Array.isArray(boxScore?.teams) ? boxScore.teams : [];
  const players = Array.isArray(boxScore?.players) ? boxScore.players : [];

  if (teams.length < 2) {
    return null;
  }

  const awayTeam = teams[0];
  const homeTeam = teams[1];

  const awayPoints = Number(awayTeam?.PTS) || 0;
  const homePoints = Number(homeTeam?.PTS) || 0;

  const awayWon = awayPoints > homePoints;
  const homeWon = homePoints > awayPoints;

  const matchedPlayer = players.find((player) =>
    isPlayerMatch(player?.PLAYER_NAME, selectedPlayerName),
  );

  return (
    <div className="boxscore-panel">
      <div className="boxscore-game-summary">
        <div
          className={`boxscore-summary-team boxscore-summary-away ${
            awayWon ? "boxscore-summary-winner" : ""
          } team-${slugTeamName(awayTeam)}`}
        >
          <div className="boxscore-summary-team-name">
            {awayTeam?.TEAM_CITY} {awayTeam?.TEAM_NAME}
          </div>
          <div className="boxscore-summary-team-code">
            {awayTeam?.TEAM_ABBREVIATION}
          </div>
          <div className="boxscore-summary-score">{awayPoints}</div>
        </div>

        <div className="boxscore-summary-center">
          <div className="boxscore-summary-label">Final Score</div>
          <div className="boxscore-summary-scoreline">
            {awayPoints} - {homePoints}
          </div>
        </div>

        <div
          className={`boxscore-summary-team boxscore-summary-home ${
            homeWon ? "boxscore-summary-winner" : ""
          } team-${slugTeamName(homeTeam)}`}
        >
          <div className="boxscore-summary-team-name">
            {homeTeam?.TEAM_CITY} {homeTeam?.TEAM_NAME}
          </div>
          <div className="boxscore-summary-team-code">
            {homeTeam?.TEAM_ABBREVIATION}
          </div>
          <div className="boxscore-summary-score">{homePoints}</div>
        </div>
      </div>

      {teams.map((team, index) => {
        const teamPlayers = players.filter(
          (player) => String(player?.TEAM_ID) === String(team?.TEAM_ID),
        );

        const teamClass = index === 0 ? "team-card-away" : "team-card-home";
        const teamSlugClass = `team-${slugTeamName(team)}`;

        return (
          <section
            key={team?.TEAM_ID || `${team?.TEAM_ABBREVIATION}-${index}`}
            className={`boxscore-team-card ${teamClass} ${teamSlugClass}`}
          >
            <div className="boxscore-team-header">
              <div className="boxscore-team-title-row">
                <h4 className="boxscore-team-title">
                  {team?.TEAM_CITY} {team?.TEAM_NAME}
                </h4>
                <span className="boxscore-team-code">
                  {team?.TEAM_ABBREVIATION}
                </span>
              </div>

              <div className="boxscore-team-stats-grid">
                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">PTS</span>
                  <span className="boxscore-stat-value">
                    {formatStat(team?.PTS)}
                  </span>
                </div>

                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">REB</span>
                  <span className="boxscore-stat-value">
                    {formatStat(team?.REB)}
                  </span>
                </div>

                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">AST</span>
                  <span className="boxscore-stat-value">
                    {formatStat(team?.AST)}
                  </span>
                </div>

                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">FG%</span>
                  <span className="boxscore-stat-value">
                    {formatPct(team?.FG_PCT)}
                  </span>
                </div>

                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">3P%</span>
                  <span className="boxscore-stat-value">
                    {formatPct(team?.FG3_PCT)}
                  </span>
                </div>

                <div className="boxscore-stat-chip">
                  <span className="boxscore-stat-label">FT%</span>
                  <span className="boxscore-stat-value">
                    {formatPct(team?.FT_PCT)}
                  </span>
                </div>
              </div>
            </div>

            <div className="table-scroll boxscore-table-scroll">
              <table className="game-table boxscore-table">
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
                  {teamPlayers.map((player, playerIndex) => {
                    const isSelectedPlayer = isPlayerMatch(
                      player?.PLAYER_NAME,
                      selectedPlayerName,
                    );

                    const didNotPlay = Boolean(player?.COMMENT);

                    return (
                      <tr
                        key={`${team?.TEAM_ID}-${player?.PLAYER_ID || playerIndex}`}
                        className={[
                          isSelectedPlayer ? "selected-player-row" : "",
                          didNotPlay ? "boxscore-dnp-row" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <td className="boxscore-player-cell">
                          <span className="boxscore-player-name">
                            {player?.PLAYER_NAME || "Unknown Player"}
                          </span>

                          {player?.COMMENT ? (
                            <span className="boxscore-player-comment">
                              {player.COMMENT}
                            </span>
                          ) : null}
                        </td>

                        <td>{getDisplayValue(player, player?.MIN)}</td>
                        <td>{getDisplayValue(player, player?.PTS)}</td>
                        <td>{getDisplayValue(player, player?.REB)}</td>
                        <td>{getDisplayValue(player, player?.AST)}</td>
                        <td>{getDisplayValue(player, player?.STL)}</td>
                        <td>{getDisplayValue(player, player?.BLK)}</td>
                        <td>{getDisplayValue(player, player?.FGM)}</td>
                        <td>{getDisplayValue(player, player?.FGA)}</td>
                        <td>{getDisplayPct(player, player?.FG_PCT)}</td>
                        <td>{getDisplayValue(player, player?.FG3M)}</td>
                        <td>{getDisplayValue(player, player?.FG3A)}</td>
                        <td>{getDisplayPct(player, player?.FG3_PCT)}</td>
                        <td>{getDisplayValue(player, player?.FTM)}</td>
                        <td>{getDisplayValue(player, player?.FTA)}</td>
                        <td>{getDisplayPct(player, player?.FT_PCT)}</td>
                        <td>{getDisplayValue(player, player?.TOV)}</td>
                        <td>{getDisplayValue(player, player?.PLUS_MINUS)}</td>
                      </tr>
                    );
                  })}
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
