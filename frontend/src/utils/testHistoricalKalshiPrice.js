import {
  getKalshiCandlesticksAuto,
  getKalshiHistoricalMarket,
  getKalshiMarket,
} from "../api/kalshiApi";
import { getHistoricalEntryYesPrice } from "./historicalKalshiPricing";

export async function testHistoricalKalshiPrice({
  ticker,
  seriesTicker,
  gameStartTs,
  lookbackHours = 168,
  periodInterval = 1,
  priceSource = "yes_ask.close_dollars",
}) {
  let market = null;

  try {
    const liveResponse = await getKalshiMarket(ticker);
    market = liveResponse?.market ?? liveResponse;
  } catch {
    const historicalResponse = await getKalshiHistoricalMarket(ticker);
    market = historicalResponse?.market ?? historicalResponse;
  }

  const startTs = Number(gameStartTs) - Number(lookbackHours) * 60 * 60;
  const endTs = Number(gameStartTs);

  const candlesticks = await getKalshiCandlesticksAuto({
    ticker,
    seriesTicker: seriesTicker || market?.series_ticker,
    marketSettledTs: market?.settled_ts,
    startTs,
    endTs,
    periodInterval,
    includeLatestBeforeStart: false,
  });

  const { candle, entryPrice } = getHistoricalEntryYesPrice({
    candlestickResponse: candlesticks,
    gameStartTs,
    priceSource,
  });

  return {
    market,
    candlesticks,
    selectedCandle: candle,
    entryPrice,
  };
}
