const KALSHI_BASE_URL = "http://localhost:5000/api/kalshi";

async function safeFetchJson(url) {
  const response = await fetch(url);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    let message =
      data?.message ||
      data?.error ||
      data?.details ||
      `Request failed with status ${response.status}`;

    if (typeof message === "object") {
      message = JSON.stringify(message);
    }

    throw new Error(message);
  }

  return data;
}

export async function getKalshiMarkets({
  status = "",
  limit = 100,
  cursor = "",
  tickers = "",
  eventTicker = "",
  seriesTicker = "",
} = {}) {
  const params = new URLSearchParams();

  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  if (tickers) params.set("tickers", tickers);
  if (eventTicker) params.set("event_ticker", eventTicker);
  if (seriesTicker) params.set("series_ticker", seriesTicker);

  return safeFetchJson(`${KALSHI_BASE_URL}/markets?${params.toString()}`);
}

export async function getKalshiMarket(ticker) {
  if (!ticker?.trim()) {
    throw new Error("Ticker is required");
  }

  const safeTicker = encodeURIComponent(ticker.trim());
  return safeFetchJson(`${KALSHI_BASE_URL}/markets/${safeTicker}`);
}

export async function getKalshiOrderbook(ticker) {
  if (!ticker?.trim()) {
    throw new Error("Ticker is required");
  }

  const safeTicker = encodeURIComponent(ticker.trim());
  return safeFetchJson(`${KALSHI_BASE_URL}/markets/${safeTicker}/orderbook`);
}

export async function getKalshiMarketBundle(ticker) {
  const [marketResponse, orderbookResponse] = await Promise.all([
    getKalshiMarket(ticker),
    getKalshiOrderbook(ticker),
  ]);

  return {
    market: marketResponse?.market ?? marketResponse,
    orderbook: orderbookResponse?.orderbook ?? orderbookResponse,
    rawMarketResponse: marketResponse,
    rawOrderbookResponse: orderbookResponse,
  };
}

export async function getKalshiHistoricalCutoff() {
  return safeFetchJson(`${KALSHI_BASE_URL}/historical/cutoff`);
}

export async function getKalshiHistoricalMarket(ticker) {
  if (!ticker?.trim()) {
    throw new Error("Market ticker is required");
  }

  const safeTicker = encodeURIComponent(ticker.trim());
  return safeFetchJson(`${KALSHI_BASE_URL}/historical/markets/${safeTicker}`);
}

export async function getKalshiMarketCandlesticks({
  ticker,
  seriesTicker,
  startTs,
  endTs,
  periodInterval = 1,
  includeLatestBeforeStart = false,
}) {
  if (!ticker?.trim()) {
    throw new Error("Market ticker is required");
  }

  if (!seriesTicker?.trim()) {
    throw new Error("Series ticker is required for live candlesticks");
  }

  const params = new URLSearchParams({
    start_ts: String(startTs),
    end_ts: String(endTs),
    period_interval: String(periodInterval),
    include_latest_before_start: String(includeLatestBeforeStart),
  });

  const safeSeries = encodeURIComponent(seriesTicker.trim());
  const safeTicker = encodeURIComponent(ticker.trim());

  return safeFetchJson(
    `${KALSHI_BASE_URL}/series/${safeSeries}/markets/${safeTicker}/candlesticks?${params.toString()}`,
  );
}

export async function getKalshiHistoricalCandlesticks({
  ticker,
  startTs,
  endTs,
  periodInterval = 1,
  includeLatestBeforeStart = false,
}) {
  if (!ticker?.trim()) {
    throw new Error("Market ticker is required");
  }

  const params = new URLSearchParams({
    start_ts: String(startTs),
    end_ts: String(endTs),
    period_interval: String(periodInterval),
    include_latest_before_start: String(includeLatestBeforeStart),
  });

  const safeTicker = encodeURIComponent(ticker.trim());

  return safeFetchJson(
    `${KALSHI_BASE_URL}/historical/markets/${safeTicker}/candlesticks?${params.toString()}`,
  );
}

export async function getKalshiCandlesticksAuto({
  ticker,
  seriesTicker,
  marketSettledTs,
  startTs,
  endTs,
  periodInterval = 1,
  includeLatestBeforeStart = false,
}) {
  const nowTs = Math.floor(Date.now() / 1000);

  const hasSettledTs = Number.isFinite(marketSettledTs);
  const isHistoricalBySettlement =
    Number.isFinite(endTs) && hasSettledTs && endTs <= marketSettledTs;

  const isHistoricalByPastWindow = Number.isFinite(endTs) && endTs < nowTs;

  const shouldUseHistorical =
    isHistoricalBySettlement || isHistoricalByPastWindow || !seriesTicker;

  try {
    if (shouldUseHistorical) {
      return await getKalshiHistoricalCandlesticks({
        ticker,
        startTs,
        endTs,
        periodInterval,
        includeLatestBeforeStart,
      });
    }

    return await getKalshiMarketCandlesticks({
      ticker,
      seriesTicker,
      startTs,
      endTs,
      periodInterval,
      includeLatestBeforeStart,
    });
  } catch (error) {
    const message = String(error?.message || "");

    const isNotFound =
      message.includes("not found") ||
      message.includes("failed_to_get_market_by_ticker") ||
      message.includes("404");

    if (isNotFound) {
      return { candlesticks: [] };
    }

    throw error;
  }
}
export async function getAllKalshiMarkets({
  status = "",
  perPage = 500,
  maxPages = 10,
  eventTicker = "",
  seriesTicker = "",
} = {}) {
  let cursor = "";
  const allMarkets = [];

  for (let page = 0; page < maxPages; page += 1) {
    const response = await getKalshiMarkets({
      ...(status ? { status } : {}),
      limit: perPage,
      ...(cursor ? { cursor } : {}),
      ...(eventTicker ? { eventTicker } : {}),
      ...(seriesTicker ? { seriesTicker } : {}),
    });

    const markets = response?.markets ?? [];
    allMarkets.push(...markets);

    const nextCursor =
      response?.cursor ?? response?.next_cursor ?? response?.nextCursor ?? "";

    if (!nextCursor || markets.length === 0) {
      break;
    }

    cursor = nextCursor;
  }

  return allMarkets;
}

export async function getKalshiEvents({
  status = "",
  limit = 100,
  cursor = "",
  seriesTicker = "",
  withNestedMarkets = false,
} = {}) {
  const params = new URLSearchParams();

  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  if (seriesTicker) params.set("series_ticker", seriesTicker);
  if (withNestedMarkets) params.set("with_nested_markets", "true");

  return safeFetchJson(`${KALSHI_BASE_URL}/events?${params.toString()}`);
}

export async function getKalshiEvent(
  eventTicker,
  { withNestedMarkets = false } = {},
) {
  if (!eventTicker?.trim()) {
    throw new Error("Event ticker is required");
  }

  const params = new URLSearchParams();
  if (withNestedMarkets) params.set("with_nested_markets", "true");

  const safeEventTicker = encodeURIComponent(eventTicker.trim());
  const query = params.toString();

  return safeFetchJson(
    `${KALSHI_BASE_URL}/events/${safeEventTicker}${query ? `?${query}` : ""}`,
  );
}

export async function getAllKalshiEvents({
  status = "",
  perPage = 200,
  maxPages = 10,
  seriesTicker = "",
  withNestedMarkets = false,
} = {}) {
  let cursor = "";
  const allEvents = [];

  for (let page = 0; page < maxPages; page += 1) {
    const response = await getKalshiEvents({
      ...(status ? { status } : {}),
      limit: perPage,
      ...(cursor ? { cursor } : {}),
      ...(seriesTicker ? { seriesTicker } : {}),
      withNestedMarkets,
    });

    const events = response?.events ?? [];
    allEvents.push(...events);

    const nextCursor =
      response?.cursor ?? response?.next_cursor ?? response?.nextCursor ?? "";

    if (!nextCursor || events.length === 0) {
      break;
    }

    cursor = nextCursor;
  }

  return allEvents;
}
