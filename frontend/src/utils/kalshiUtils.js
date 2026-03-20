// frontend/src/utils/kalshiUtils.js

export function getEntrySnapshotFromCandles(candles = []) {
  if (!Array.isArray(candles) || candles.length === 0) {
    return null;
  }

  const candle = candles[candles.length - 1];

  const ask = Number(candle?.yes_ask?.close_dollars);
  const bid = Number(candle?.yes_bid?.close_dollars);
  const prev = Number(candle?.price?.previous_dollars);

  return {
    endPeriodTs: candle?.end_period_ts ?? null,
    yesAsk: Number.isFinite(ask) ? ask : null,
    yesBid: Number.isFinite(bid) ? bid : null,
    previousPrice: Number.isFinite(prev) ? prev : null,
    volume: candle?.volume_fp ?? null,
    openInterest: candle?.open_interest_fp ?? null,
  };
}
