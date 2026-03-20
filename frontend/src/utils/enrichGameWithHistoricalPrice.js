import { getKalshiCandlesticksAuto } from "../api/kalshiApi";
import { getPregameEntryFromCandles } from "./getPregameEntryFromCandles";
import { clampPrice } from "./contractMath";

export async function enrichGameWithHistoricalPrice(
  game,
  { lookbackHours = 168, periodInterval = 1 } = {},
) {
  console.log("ENRICH FUNCTION RAN", game);

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
    game?.marketMatch?.rawMarket?.event_ticker ??
    null;

  const rawSettledTs =
    game?.marketSettledTs ??
    game?.market_settled_ts ??
    game?.marketMatch?.marketSettledTs ??
    game?.marketMatch?.rawMarket?.settled_ts ??
    game?.marketMatch?.rawMarket?.market_settled_ts ??
    game?.marketMatch?.rawMarket?.close_time;

  const marketSettledTs = Number(rawSettledTs);

  const rawGameStartTs = game?.gameStartTs ?? game?.gameStartUnix;
  const gameStartTs = Number(rawGameStartTs);

  console.log("CANDLESTICK INPUT DEBUG", {
    gameId: game?.gameId,
    matchup: game?.matchup,
    ticker,
    seriesTicker,
    marketSettledTs,
    gameStartTs,
    rawSettledTs,
    rawGameStartTs,
    marketMatch: game?.marketMatch,
  });

  if (!ticker) {
    console.log("MISSING marketTicker", game);
    return {
      ...game,
      entryYesPrice: null,
      priceTimestamp: null,
      priceError: "Missing marketTicker",
    };
  }

  if (!Number.isFinite(gameStartTs) || gameStartTs <= 0) {
    console.log("MISSING gameStartTs", game);
    return {
      ...game,
      entryYesPrice: null,
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
      ? Math.ceil((endTs - startTs) / 60 / MAX_CANDLES)
      : requestedInterval;

  console.log("CANDLE RANGE DEBUG", {
    gameId: game?.gameId,
    matchup: game?.matchup,
    lookbackHours,
    startTs,
    endTs,
    requestedInterval,
    requestedCandles,
    safePeriodInterval,
  });
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

    console.log("KALSHI CANDLE RESPONSE", {
      gameId: game?.gameId,
      matchup: game?.matchup,
      ticker,
      response,
    });

    const candles =
      response?.candlesticks ?? response?.history ?? response?.data ?? [];

    const entry = getPregameEntryFromCandles(candles, gameStartTs);

    console.log("SELECTED ENTRY", {
      gameId: game?.gameId,
      matchup: game?.matchup,
      ticker,
      entry,
    });

    if (!entry) {
      return {
        ...game,
        marketTicker: ticker,
        seriesTicker,
        marketSettledTs: Number.isFinite(marketSettledTs)
          ? marketSettledTs
          : null,
        entryYesPrice: null,
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
      entryYesPrice: clampPrice(entry.yesPrice),
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
      priceTimestamp: null,
      priceError: error.message || "Failed to fetch historical price",
    };
  }
}
