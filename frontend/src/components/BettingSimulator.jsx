import { useMemo, useState } from "react";
import { simulatePredictionMarkets } from "../utils/simulatePredictionMarkets";

const statOptions = [
  { label: "Points", value: "points" },
  { label: "Rebounds", value: "rebounds" },
  { label: "Assists", value: "assists" },
  { label: "Minutes", value: "minutes" },
  { label: "Threes", value: "threePointersMade" },
];

function BettingSimulator({ games, selectedStat, title }) {
  const [statKey, setStatKey] = useState(selectedStat || "points");
  const [marketType, setMarketType] = useState("over");
  const [line, setLine] = useState(25.5);
  const [yesPrice, setYesPrice] = useState(0.58);
  const [contracts, setContracts] = useState(10);
  const [side, setSide] = useState("yes");
  const [ignoreMissedGames, setIgnoreMissedGames] = useState(true);

  const simulation = useMemo(() => {
    return simulatePredictionMarkets({
      games,
      statKey,
      line,
      marketType,
      yesPrice,
      contracts,
      side,
      ignoreMissedGames,
    });
  }, [
    games,
    statKey,
    line,
    marketType,
    yesPrice,
    contracts,
    side,
    ignoreMissedGames,
  ]);

  const { summary, results } = simulation;

  return (
    <section className="panel-card betting-screen">
      <div className="betting-screen-header">
        <div>
          <h2 className="panel-title">Prediction Market Simulator</h2>
          {title ? <p className="betting-subtitle">{title}</p> : null}
        </div>
      </div>

      <div className="bet-controls-grid">
        <label>
          Stat
          <select value={statKey} onChange={(e) => setStatKey(e.target.value)}>
            {statOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Market Type
          <select
            value={marketType}
            onChange={(e) => setMarketType(e.target.value)}
          >
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
          Yes Price
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="0.99"
            value={yesPrice}
            onChange={(e) => setYesPrice(e.target.value)}
          />
        </label>

        <label>
          Side
          <select value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="yes">Buy Yes</option>
            <option value="no">Buy No</option>
          </select>
        </label>

        <label>
          Contracts
          <input
            type="number"
            step="1"
            min="1"
            value={contracts}
            onChange={(e) => setContracts(e.target.value)}
          />
        </label>
      </div>

      <label className="checkbox-row betting-checkbox">
        <input
          type="checkbox"
          checked={ignoreMissedGames}
          onChange={(e) => setIgnoreMissedGames(e.target.checked)}
        />
        Ignore Missed Games
      </label>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Trades</div>
          <div className="summary-value">{summary.totalTrades}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Record</div>
          <div className="summary-value">
            {summary.wins}-{summary.losses}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Total Cost</div>
          <div className="summary-value">${summary.totalCost.toFixed(2)}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Net PnL</div>
          <div
            className={`summary-value ${
              summary.totalPnl >= 0 ? "value-positive" : "value-negative"
            }`}
          >
            {summary.totalPnl >= 0 ? "+" : ""}${summary.totalPnl.toFixed(2)}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">ROI</div>
          <div
            className={`summary-value ${
              summary.roiPercent >= 0 ? "value-positive" : "value-negative"
            }`}
          >
            {summary.roiPercent >= 0 ? "+" : ""}
            {summary.roiPercent.toFixed(2)}%
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Avg Edge</div>
          <div
            className={`summary-value ${
              summary.avgEdgePercent >= 0 ? "value-positive" : "value-negative"
            }`}
          >
            {summary.avgEdgePercent >= 0 ? "+" : ""}
            {summary.avgEdgePercent.toFixed(2)}%
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
              <th>Market</th>
              <th>Side</th>
              <th>Yes</th>
              <th>Model %</th>
              <th>Edge</th>
              <th>Contracts</th>
              <th>Cost</th>
              <th>PnL</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={row.gameId ?? `${row.date}-${index}`}>
                <td>{row.date}</td>
                <td>{row.matchup}</td>
                <td>{row.statValue}</td>
                <td>{row.marketQuestion}</td>
                <td>{row.side}</td>
                <td>{Math.round(row.yesPrice * 100)}¢</td>
                <td>{(row.modelProbability * 100).toFixed(1)}%</td>
                <td
                  className={
                    row.edgePercent >= 0 ? "edge-positive" : "edge-negative"
                  }
                >
                  {row.edgePercent >= 0 ? "+" : ""}
                  {row.edgePercent.toFixed(1)}%
                </td>
                <td>{row.contracts}</td>
                <td>${row.cost.toFixed(2)}</td>
                <td className={row.pnl >= 0 ? "pnl-positive" : "pnl-negative"}>
                  {row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(2)}
                </td>
                <td>
                  <span
                    className={`outcome-pill ${
                      row.outcome === "yes" ? "outcome-yes" : "outcome-no"
                    }`}
                  >
                    {row.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BettingSimulator;
