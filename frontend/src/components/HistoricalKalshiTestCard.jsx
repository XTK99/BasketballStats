import { useState } from "react";
import { testHistoricalKalshiPrice } from "../utils/testHistoricalKalshiPrice";
import {
  formatContractPrice,
  formatPercentFromPrice,
} from "../utils/kalshiPricing";

function HistoricalKalshiTestCard() {
  const [ticker, setTicker] = useState("");
  const [seriesTicker, setSeriesTicker] = useState("");
  const [gameStartTs, setGameStartTs] = useState("");
  const [lookbackHours, setLookbackHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleTest() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await testHistoricalKalshiPrice({
        ticker,
        seriesTicker,
        gameStartTs: Number(gameStartTs),
        lookbackHours: Number(lookbackHours),
        periodInterval: 1,
        priceSource: "yes_ask.close_dollars",
      });

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to test historical price");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-card">
      <h3 className="panel-title">Historical Kalshi Price Test</h3>

      <div className="bet-controls-grid">
        <label>
          Market Ticker
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter market ticker"
          />
        </label>

        <label>
          Series Ticker
          <input
            type="text"
            value={seriesTicker}
            onChange={(e) => setSeriesTicker(e.target.value)}
            placeholder="Optional if known"
          />
        </label>

        <label>
          Game Start TS
          <input
            type="number"
            value={gameStartTs}
            onChange={(e) => setGameStartTs(e.target.value)}
            placeholder="Unix seconds"
          />
        </label>

        <label>
          Lookback Hours
          <input
            type="number"
            min="1"
            value={lookbackHours}
            onChange={(e) => setLookbackHours(e.target.value)}
          />
        </label>
      </div>

      <div className="historical-test-actions">
        <button
          type="button"
          className="search-button"
          onClick={handleTest}
          disabled={loading || !ticker.trim() || !gameStartTs}
        >
          {loading ? "Testing..." : "Fetch Historical Price"}
        </button>
      </div>

      {error && <p className="status-error">{error}</p>}

      {result && (
        <div className="market-snapshot">
          <div className="market-snapshot-card">
            <div className="market-snapshot-label">Ticker</div>
            <div className="market-snapshot-value">
              {result.market?.ticker || ticker}
            </div>
          </div>

          <div className="market-snapshot-card market-snapshot-wide">
            <div className="market-snapshot-label">Market</div>
            <div className="market-snapshot-value">
              {result.market?.title ||
                result.market?.subtitle ||
                result.market?.question ||
                "Kalshi Market"}
            </div>
          </div>

          <div className="market-snapshot-card">
            <div className="market-snapshot-label">Historical Entry</div>
            <div className="market-snapshot-value">
              {formatContractPrice(result.entryPrice)}
            </div>
          </div>

          <div className="market-snapshot-card">
            <div className="market-snapshot-label">Implied %</div>
            <div className="market-snapshot-value">
              {formatPercentFromPrice(result.entryPrice)}
            </div>
          </div>

          <div className="market-snapshot-card">
            <div className="market-snapshot-label">Selected Candle End</div>
            <div className="market-snapshot-value">
              {result.selectedCandle?.end_period_ts || "--"}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HistoricalKalshiTestCard;
