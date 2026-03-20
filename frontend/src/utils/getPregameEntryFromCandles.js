function normalizeKalshiPrice(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  // Already decimal dollars/probability style, like 0.58
  if (numeric >= 0 && numeric <= 1) {
    return numeric;
  }

  // Kalshi often returns cents, like 58 for 58¢
  if (numeric >= 1 && numeric <= 100) {
    return numeric / 100;
  }

  return null;
}

function getYesPriceFromCandle(candle) {
  const candidates = [
    candle?.yes_ask?.close,
    candle?.yes_bid?.close,
    candle?.yes_price?.close,
    candle?.yes_ask_close,
    candle?.yes_bid_close,
    candle?.yes_close,
    candle?.yes_ask,
    candle?.yes_bid,
    candle?.yes_price,
    candle?.close,
  ];

  for (const value of candidates) {
    const normalized = normalizeKalshiPrice(value);

    if (normalized != null) {
      return normalized;
    }
  }

  return null;
}

function getCandleTs(candle) {
  const candidates = [
    candle?.end_period_ts,
    candle?.end_ts,
    candle?.close_ts,
    candle?.ts,
    candle?.period_end_ts,
    candle?.start_period_ts,
    candle?.start_ts,
  ];

  for (const value of candidates) {
    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return null;
}

export function getPregameEntryFromCandles(candles, gameStartTs) {
  const safeCandles = Array.isArray(candles) ? candles : [];

  const eligible = safeCandles
    .map((candle) => {
      const ts = getCandleTs(candle);
      const yesPrice = getYesPriceFromCandle(candle);

      return {
        ts,
        yesPrice,
        raw: candle,
      };
    })
    .filter(
      (row) =>
        Number.isFinite(row.ts) &&
        Number.isFinite(row.yesPrice) &&
        row.ts <= Number(gameStartTs),
    )
    .sort((a, b) => b.ts - a.ts);

  if (eligible.length === 0) {
    return null;
  }

  console.log("selected historical entry", eligible[0]);

  return eligible[0];
}
