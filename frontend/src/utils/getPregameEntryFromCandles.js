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

export function getPregameEntryFromCandles(candles = [], gameStartTs) {
  if (!Array.isArray(candles) || candles.length === 0) {
    return null;
  }

  const sorted = [...candles]
    .map((candle) => ({
      ...candle,
      ts: Number(candle?.end_period_ts),
    }))
    .filter((candle) => Number.isFinite(candle.ts))
    .sort((a, b) => a.ts - b.ts);

  if (sorted.length === 0) {
    return null;
  }

  let chosen = null;

  for (const candle of sorted) {
    if (candle.ts <= gameStartTs) {
      chosen = candle;
    } else {
      break;
    }
  }

  if (!chosen) {
    return null;
  }

  const yesAsk = Number(chosen?.yes_ask?.close_dollars);
  const yesBid = Number(chosen?.yes_bid?.close_dollars);
  const previousPrice = Number(chosen?.price?.previous_dollars);

  return {
    ts: chosen.ts,
    yesAsk: Number.isFinite(yesAsk) ? yesAsk : null,
    yesBid: Number.isFinite(yesBid) ? yesBid : null,
    previousPrice: Number.isFinite(previousPrice) ? previousPrice : null,
  };
}
