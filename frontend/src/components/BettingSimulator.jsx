import { useMemo, useState } from "react";
import { simulateBets } from "../utils/simulateBets";

function BettingSimulator({ games, selectedStat }) {
  const [betType, setBetType] = useState("over");
  const [line, setLine] = useState(25.5);
  const [stake, setStake] = useState(10);
  const [odds, setOdds] = useState(-110);
  const [startingBankroll, setStartingBankroll] = useState(100);
  const [ignoreMissedGames, setIgnoreMissedGames] = useState(true);

  const simulation = useMemo(() => {
    return simulateBets({
      games,
      statKey: selectedStat,
      line,
      betType,
      stake,
      odds,
      startingBankroll,
      ignoreMissedGames,
    });
  }, [
    games,
    selectedStat,
    line,
    betType,
    stake,
    odds,
    startingBankroll,
    ignoreMissedGames,
  ]);

  const { summary, results } = simulation;

  return (
    <section className="panel-card">
      <h3 className="panel-title">Betting Simulator</h3>

      <div className="bet-controls">
        <label>
          Bet Type
          <select value={betType} onChange={(e) => setBetType(e.target.value)}>
            <option value="over">Over</option>
            <option value="under">Under</option>
          </select>
        </label>

        <label>
          Line
          <input
            type="number"
            step="0.5"
            value={line}
            onChange={(e) => setLine(e.target.value)}
          />
        </label>

        <label>
          Stake
          <input
            type="number"
            step="1"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
        </label>

        <label>
          Odds
          <input
            type="number"
            step="1"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
          />
        </label>

        <label>
          Starting Bankroll
          <input
            type="number"
            step="1"
            value={startingBankroll}
            onChange={(e) => setStartingBankroll(e.target.value)}
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={ignoreMissedGames}
            onChange={(e) => setIgnoreMissedGames(e.target.checked)}
          />
          Ignore Missed Games
        </label>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Record</div>
          <div className="summary-value">
            {summary.wins}-{summary.losses}-{summary.pushes}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Win Rate</div>
          <div className="summary-value">{summary.winRate.toFixed(1)}%</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Profit</div>
          <div className="summary-value">{summary.totalProfit.toFixed(2)}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">ROI</div>
          <div className="summary-value">{summary.roi.toFixed(1)}%</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Wagered</div>
          <div className="summary-value">{summary.totalWagered.toFixed(2)}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Ending Bankroll</div>
          <div className="summary-value">
            {summary.endingBankroll.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="game-log-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Matchup</th>
              <th>Stat</th>
              <th>Line</th>
              <th>Bet</th>
              <th>Outcome</th>
              <th>Profit</th>
              <th>Bankroll</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.gameId ?? `${result.date}-${index}`}>
                <td>{result.date}</td>
                <td>{result.matchup}</td>
                <td>{result.statValue}</td>
                <td>{result.line}</td>
                <td>{result.betType}</td>
                <td>{result.outcome}</td>
                <td>{result.profit.toFixed(2)}</td>
                <td>{result.bankrollAfter.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BettingSimulator;
