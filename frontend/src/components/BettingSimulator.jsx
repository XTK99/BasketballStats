import { useEffect, useMemo, useState } from "react";
import { simulatePredictionMarkets } from "../utils/simulatePredictionMarkets";
import { getKalshiMarketBundle, getAllKalshiEvents } from "../api/kalshiApi";
import { enrichGameWithHistoricalPrice } from "../utils/enrichGameWithHistoricalPrice";
import {
  getBestYesBid,
  getBestNoBid,
  getBestYesAsk,
  getBestNoAsk,
  getMidYesPrice,
  getEntryYesPrice,
  formatContractPrice,
  formatPercentFromPrice,
} from "../utils/kalshiPricing";
import { findKalshiMarketForGame } from "../utils/findKalshiMarketForGame";
import { findKalshiEventForGame } from "../utils/findKalshiEventForGame";

const statOptions = [
  { label: "Points", value: "points" },
  { label: "Rebounds", value: "rebounds" },
  { label: "Assists", value: "assists" },
  { label: "Minutes", value: "minutes" },
  { label: "Threes", value: "threePointersMade" },
];

function BettingSimulator({ games, selectedStat, title, playerName }) {
  const [historicalGames, setHistoricalGames] = useState([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalError, setHistoricalError] = useState("");
  const [lookbackHours, setLookbackHours] = useState(24);

  const [statKey, setStatKey] = useState(selectedStat || "points");
  const [marketType, setMarketType] = useState("over");
  const [line, setLine] = useState(24.5);
  const [yesPrice, setYesPrice] = useState(0.58);
  const [contracts, setContracts] = useState(10);
  const [side, setSide] = useState("yes");
  const [ignoreMissedGames, setIgnoreMissedGames] = useState(true);

  const [priceSource, setPriceSource] = useState("manual");
  const [tickerInput, setTickerInput] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [orderbookData, setOrderbookData] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");

  useEffect(() => {
    setStatKey(selectedStat || "points");
  }, [selectedStat]);

  async function handleLoadKalshiMarket() {
    if (!tickerInput.trim()) return;

    try {
      setMarketLoading(true);
      setMarketError("");

      const bundle = await getKalshiMarketBundle(tickerInput.trim());

      setSelectedTicker(tickerInput.trim());
      setMarketData(bundle.market);
      setOrderbookData(bundle.orderbook);
    } catch (err) {
      console.error(err);
      setMarketError(err.message || "Failed to load Kalshi market");
      setMarketData(null);
      setOrderbookData(null);
    } finally {
      setMarketLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadHistoricalGames() {
      if (priceSource !== "historical") {
        setHistoricalGames([]);
        setHistoricalError("");
        setHistoricalLoading(false);
        return;
      }

      const safeGames = Array.isArray(games) ? games : [];

      if (safeGames.length === 0) {
        setHistoricalGames([]);
        setHistoricalError("");
        setHistoricalLoading(false);
        return;
      }

      try {
        setHistoricalLoading(true);
        setHistoricalError("");
        setHistoricalGames([]);

        const events = await getAllKalshiEvents({
          perPage: 200,
          maxPages: 10,
          withNestedMarkets: true,
        });

        const enrichedResults = [];

        for (const game of safeGames) {
          if (cancelled) return;

          const matchingEvent = findKalshiEventForGame({
            events,
            game,
            playerName: playerName || "LeBron James",
          });

          const eventMarkets = matchingEvent?.markets ?? [];

          const marketMatch = findKalshiMarketForGame({
            markets: eventMarkets,
            playerName: playerName || "LeBron James",
            statKey,
            line: Number(line),
            marketType,
            opponent: game.opponent,
            gameId: game.gameId,
            matchup: game.matchup,
          });

          const gameWithMarket = {
            ...game,
            matchingEvent,
            marketMatch,
            marketTicker:
              marketMatch?.marketTicker ?? marketMatch?.ticker ?? null,
            seriesTicker:
              marketMatch?.seriesTicker ?? marketMatch?.series_ticker ?? null,
            marketSettledTs:
              marketMatch?.marketSettledTs ??
              marketMatch?.market_settled_ts ??
              null,
            marketTitle: marketMatch?.marketTitle ?? marketMatch?.title ?? null,
            gameStartTs: game.gameStartTs ?? game.gameStartUnix ?? null,
          };

          if (!gameWithMarket.marketTicker) {
            enrichedResults.push({
              ...gameWithMarket,
              entryYesPrice: null,
              priceTimestamp: null,
              priceError: matchingEvent
                ? "No Kalshi market match found inside matched event"
                : "No Kalshi event match found",
            });
            continue;
          }

          const enrichedGame = await enrichGameWithHistoricalPrice(
            gameWithMarket,
            {
              lookbackHours: Number(lookbackHours || 24),
              periodInterval: 1,
            },
          );

          enrichedResults.push(enrichedGame);
        }

        if (!cancelled) {
          setHistoricalGames(enrichedResults);
        }
      } catch (error) {
        console.error("LOAD HISTORICAL GAMES ERROR", error);

        if (!cancelled) {
          setHistoricalGames([]);
          setHistoricalError(
            error.message || "Failed to load historical market prices",
          );
        }
      } finally {
        if (!cancelled) {
          setHistoricalLoading(false);
        }
      }
    }

    loadHistoricalGames();

    return () => {
      cancelled = true;
    };
  }, [
    games,
    priceSource,
    lookbackHours,
    statKey,
    line,
    marketType,
    title,
    playerName,
  ]);

  const liveYesBid = getBestYesBid(orderbookData);
  const liveNoBid = getBestNoBid(orderbookData);
  const liveYesAsk = getBestYesAsk(orderbookData);
  const liveNoAsk = getBestNoAsk(orderbookData);
  const liveMidYes = getMidYesPrice(orderbookData);

  const activeYesPrice =
    priceSource === "kalshi" && orderbookData
      ? getEntryYesPrice(orderbookData, side)
      : priceSource === "manual"
        ? Number(yesPrice)
        : null;

  const simulationGames = useMemo(() => {
    if (priceSource !== "historical") {
      return Array.isArray(games) ? games : [];
    }

    if (historicalLoading) {
      return [];
    }

    return (Array.isArray(historicalGames) ? historicalGames : []).filter(
      (game) =>
        game.entryYesPrice !== null &&
        game.entryYesPrice !== undefined &&
        Number.isFinite(game.entryYesPrice),
    );
  }, [games, historicalGames, priceSource, historicalLoading]);

  const simulation = useMemo(() => {
    return simulatePredictionMarkets({
      games: simulationGames,
      statKey,
      line,
      marketType,
      yesPrice: activeYesPrice,
      contracts,
      side,
      ignoreMissedGames,
    });
  }, [
    simulationGames,
    statKey,
    line,
    marketType,
    activeYesPrice,
    contracts,
    side,
    ignoreMissedGames,
  ]);

  const { summary, results } = simulation;

  const shouldShowNoHistoricalMatches =
    priceSource === "historical" &&
    !historicalLoading &&
    !historicalError &&
    historicalGames.length > 0 &&
    simulationGames.length === 0;

  const displayedResults =
    priceSource === "historical" && simulationGames.length === 0 ? [] : results;

  const displayedSummary =
    priceSource === "historical" && simulationGames.length === 0
      ? {
          totalTrades: 0,
          wins: 0,
          losses: 0,
          totalCost: 0,
          totalPnl: 0,
          roiPercent: 0,
          avgEdgePercent: 0,
        }
      : summary;

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
          Price Source
          <select
            value={priceSource}
            onChange={(e) => setPriceSource(e.target.value)}
          >
            <option value="manual">Manual</option>
            <option value="kalshi">Single Live Kalshi Price</option>
            <option value="historical">Historical Pregame Price</option>
          </select>
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

        {priceSource === "manual" ? (
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
        ) : (
          <label>
            Applied Yes Price
            <input
              type="text"
              value={
                activeYesPrice == null
                  ? "--"
                  : formatContractPrice(activeYesPrice)
              }
              readOnly
            />
          </label>
        )}
      </div>

      {priceSource === "kalshi" && (
        <div className="kalshi-tools">
          <div className="kalshi-market-row">
            <input
              className="search-input"
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              placeholder="Enter Kalshi market ticker"
            />
            <button
              type="button"
              className="search-button"
              onClick={handleLoadKalshiMarket}
              disabled={marketLoading || !tickerInput.trim()}
            >
              {marketLoading ? "Loading..." : "Load Market"}
            </button>
          </div>

          {marketError && <p className="status-error">{marketError}</p>}

          {marketData && orderbookData && (
            <>
              <div className="market-snapshot">
                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">Ticker</div>
                  <div className="market-snapshot-value">{selectedTicker}</div>
                </div>

                <div className="market-snapshot-card market-snapshot-wide">
                  <div className="market-snapshot-label">Market</div>
                  <div className="market-snapshot-value">
                    {marketData.title ||
                      marketData.subtitle ||
                      marketData.question ||
                      "Kalshi Market"}
                  </div>
                </div>

                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">Yes Bid</div>
                  <div className="market-snapshot-value">
                    {formatContractPrice(liveYesBid)}
                  </div>
                </div>

                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">Yes Ask</div>
                  <div className="market-snapshot-value">
                    {formatContractPrice(liveYesAsk)}
                  </div>
                </div>

                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">No Bid</div>
                  <div className="market-snapshot-value">
                    {formatContractPrice(liveNoBid)}
                  </div>
                </div>

                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">No Ask</div>
                  <div className="market-snapshot-value">
                    {formatContractPrice(liveNoAsk)}
                  </div>
                </div>

                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">Mid Yes</div>
                  <div className="market-snapshot-value">
                    {formatContractPrice(liveMidYes)}
                  </div>
                </div>

                <div className="market-snapshot-card">
                  <div className="market-snapshot-label">Implied</div>
                  <div className="market-snapshot-value">
                    {activeYesPrice == null
                      ? "--"
                      : formatPercentFromPrice(activeYesPrice)}
                  </div>
                </div>
              </div>

              <p className="chart-subtitle">
                This mode applies one current Kalshi market price across all
                simulated games. It does not use historical pregame pricing per
                row.
              </p>
            </>
          )}
        </div>
      )}

      {priceSource === "historical" && (
        <div className="kalshi-tools">
          <div className="bet-controls-grid">
            <label>
              Lookback Hours
              <input
                type="number"
                min="1"
                step="1"
                value={lookbackHours}
                onChange={(e) => setLookbackHours(e.target.value)}
              />
            </label>
          </div>

          {historicalLoading && (
            <p className="chart-subtitle">
              Loading historical pregame prices...
            </p>
          )}

          {historicalError && <p className="status-error">{historicalError}</p>}

          {!historicalLoading &&
            !historicalError &&
            historicalGames.length > 0 && (
              <p className="chart-subtitle">
                Using the last available Kalshi yes price before each game
                start.
              </p>
            )}

          {shouldShowNoHistoricalMatches && (
            <p className="chart-subtitle">
              No matching historical Kalshi markets were found for these games.
            </p>
          )}
        </div>
      )}

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
          <div className="summary-value">{displayedSummary.totalTrades}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Record</div>
          <div className="summary-value">
            {displayedSummary.wins}-{displayedSummary.losses}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Total Cost</div>
          <div className="summary-value">
            ${displayedSummary.totalCost.toFixed(2)}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Net PnL</div>
          <div
            className={`summary-value ${
              displayedSummary.totalPnl >= 0
                ? "value-positive"
                : "value-negative"
            }`}
          >
            {displayedSummary.totalPnl >= 0 ? "+" : ""}$
            {displayedSummary.totalPnl.toFixed(2)}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">ROI</div>
          <div
            className={`summary-value ${
              displayedSummary.roiPercent >= 0
                ? "value-positive"
                : "value-negative"
            }`}
          >
            {displayedSummary.roiPercent >= 0 ? "+" : ""}
            {displayedSummary.roiPercent.toFixed(2)}%
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Avg Edge</div>
          <div
            className={`summary-value ${
              displayedSummary.avgEdgePercent >= 0
                ? "value-positive"
                : "value-negative"
            }`}
          >
            {displayedSummary.avgEdgePercent >= 0 ? "+" : ""}
            {displayedSummary.avgEdgePercent.toFixed(2)}%
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
            {displayedResults.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", opacity: 0.7 }}>
                  {priceSource === "historical"
                    ? historicalLoading
                      ? "Loading historical prices..."
                      : "No historical simulation results available."
                    : "No simulation results available."}
                </td>
              </tr>
            ) : (
              displayedResults.map((row, index) => (
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
                  <td
                    className={row.pnl >= 0 ? "pnl-positive" : "pnl-negative"}
                  >
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BettingSimulator;
