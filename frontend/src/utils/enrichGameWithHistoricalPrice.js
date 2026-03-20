import { getKalshiCandlesticksAuto } from "../api/kalshiApi";
import { getPregameEntryFromCandles } from "./getPregameEntryFromCandles";
import { clampPrice } from "./contractMath";

export async function enrichGameWithHistoricalPrice(
  game,
  { lookbackHours = 168, periodInterval = 1 } = {},
) {
  const ticker =
    game?.marketTicker ??
    game?.ticker ??
    game?.marketMatch?.marketTicker ??
    game?.marketMatch?.rawMarket?.ticker ??
    game?.marketMatch?.rawMarket?.market_ticker ??
    game?.marketMatch?.rawMarket?.id ??
    null;

  const seriesTicker =
    game?.seriesTicker ??
    game?.series_ticker ??
    game?.marketMatch?.seriesTicker ??
    game?.marketMatch?.rawMarket?.series_ticker ??
    null;

  const rawSettledTs =
    game?.marketSettledTs ??
    game?.market_settled_ts ??
    game?.marketMatch?.marketSettledTs ??
    game?.marketMatch?.rawMarket?.settled_ts ??
    game?.marketMatch?.rawMarket?.market_settled_ts ??
    null;

  const marketSettledTs = Number(rawSettledTs);

  const rawGameStartTs = game?.gameStartTs ?? game?.gameStartUnix;
  const gameStartTs = Number(rawGameStartTs);

  if (!ticker) {
    return {
      ...game,
      entryYesPrice: null,
      entryYesBid: null,
      previousPrice: null,
      priceTimestamp: null,
      priceError: "Missing marketTicker",
    };
  }

  if (!seriesTicker) {
    return {
      ...game,
      marketTicker: ticker,
      entryYesPrice: null,
      entryYesBid: null,
      previousPrice: null,
      priceTimestamp: null,
      priceError: "Missing seriesTicker",
    };
  }

  if (!Number.isFinite(gameStartTs) || gameStartTs <= 0) {
    return {
      ...game,
      marketTicker: ticker,
      seriesTicker,
      entryYesPrice: null,
      entryYesBid: null,
      previousPrice: null,
      priceTimestamp: null,
      priceError: "Missing gameStartTs",
    };
  }

  const lookbackSeconds = Number(lookbackHours) * 60 * 60;
  const startTs = gameStartTs - lookbackSeconds;
  const endTs = gameStartTs;

  const MAX_CANDLES = 5000;
  const requestedInterval = Number(periodInterval) || 1;
  const requestedCandles = Math.ceil(
    (endTs - startTs) / 60 / requestedInterval,
  );

  const safePeriodInterval =
    requestedCandles > MAX_CANDLES
      ? Math.max(1, Math.ceil((endTs - startTs) / 60 / MAX_CANDLES))
      : requestedInterval;

  try {
    const response = await getKalshiCandlesticksAuto({
      ticker,
      seriesTicker,
      marketSettledTs: Number.isFinite(marketSettledTs)
        ? marketSettledTs
        : null,
      startTs,
      endTs,
      periodInterval: safePeriodInterval,
      includeLatestBeforeStart: true,
    });

    const candles = Array.isArray(response?.candlesticks)
      ? response.candlesticks
      : Array.isArray(response?.history)
        ? response.history
        : Array.isArray(response?.data)
          ? response.data
          : [];

    const entry = getPregameEntryFromCandles(candles, gameStartTs);

    if (!entry) {
      return {
        ...game,
        marketTicker: ticker,
        seriesTicker,
        marketSettledTs: Number.isFinite(marketSettledTs)
          ? marketSettledTs
          : null,
        entryYesPrice: null,
        entryYesBid: null,
        previousPrice: null,
        priceTimestamp: null,
        priceError: "No pregame candle found",
      };
    }

    return {
      ...game,
      marketTicker: ticker,
      seriesTicker,
      marketSettledTs: Number.isFinite(marketSettledTs)
        ? marketSettledTs
        : null,
      entryYesPrice: clampPrice(entry.yesAsk),
      entryYesBid: clampPrice(entry.yesBid),
      previousPrice: clampPrice(entry.previousPrice),
      priceTimestamp: entry.ts,
      priceError: "",
    };
  } catch (error) {
    console.error("HISTORICAL PRICE ERROR", error);

    return {
      ...game,
      marketTicker: ticker,
      seriesTicker,
      marketSettledTs: Number.isFinite(marketSettledTs)
        ? marketSettledTs
        : null,
      entryYesPrice: null,
      entryYesBid: null,
      previousPrice: null,
      priceTimestamp: null,
      priceError: error.message || "Failed to fetch historical price",
    };
  }
}
