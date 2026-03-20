function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getCandleField(candle, path) {
  const parts = path.split(".");
  let current = candle;

  for (const part of parts) {
    current = current?.[part];
    if (current == null) return null;
  }

  return toNumber(current);
}

export function normalizeCandlesticks(response) {
  const raw = response?.candlesticks ?? [];
  if (!Array.isArray(raw)) return [];

  return [...raw]
    .map((candle) => ({
      ...candle,
      endPeriodTs: Number(candle.end_period_ts ?? candle.endPeriodTs ?? 0),
    }))
    .filter((candle) => Number.isFinite(candle.endPeriodTs))
    .sort((a, b) => a.endPeriodTs - b.endPeriodTs);
}

export function findLastPregameCandle(candlestickResponse, gameStartTs) {
  const candles = normalizeCandlesticks(candlestickResponse);

  let best = null;

  for (const candle of candles) {
    if (candle.endPeriodTs <= gameStartTs) {
      best = candle;
    }
  }

  return best;
}

export function extractEntryPriceFromCandle(
  candle,
  priceSource = "yes_ask.close_dollars",
) {
  if (!candle) return null;

  const fallbacks = [
    priceSource,
    "yes_ask.close_dollars",
    "yes_bid.close_dollars",
    "price.close_dollars",
    "price.mean_dollars",
    "price.previous_dollars",
  ];

  for (const field of fallbacks) {
    const value = getCandleField(candle, field);
    if (value != null) {
      return Number(value.toFixed(4));
    }
  }

  return null;
}

export function getHistoricalEntryYesPrice({
  candlestickResponse,
  gameStartTs,
  priceSource = "yes_ask.close_dollars",
}) {
  const candle = findLastPregameCandle(candlestickResponse, gameStartTs);
  const entryPrice = extractEntryPriceFromCandle(candle, priceSource);

  return {
    candle,
    entryPrice,
  };
}
