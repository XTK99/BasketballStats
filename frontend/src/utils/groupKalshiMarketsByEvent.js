function getMarketType(ticker = "") {
  const value = String(ticker || "").toUpperCase();

  if (value.startsWith("KXNBAGAME-")) return "game";
  if (value.startsWith("KXNBASPREAD-")) return "spread";
  if (value.startsWith("KXNBATOTAL-")) return "total";
  if (value.startsWith("KXNBAPTS-")) return "points";
  if (value.startsWith("KXNBAREB-")) return "rebounds";
  if (value.startsWith("KXNBAAST-")) return "assists";
  if (value.startsWith("KXNBA3PT-")) return "threes";
  if (value.startsWith("KXNBA-")) return "futures";

  return "other";
}

function parseEventParts(eventTicker = "") {
  const value = String(eventTicker || "").toUpperCase();

  const match = value.match(
    /^KXNBA(?:GAME|SPREAD|TOTAL|PTS|REB|AST|3PT)-(\d{2}[A-Z]{3}\d{2})([A-Z0-9]+)$/,
  );

  if (!match) {
    return {
      dateCode: null,
      matchupCode: null,
    };
  }

  return {
    dateCode: match[1],
    matchupCode: match[2],
  };
}

export function groupKalshiMarketsByEvent(markets = []) {
  const grouped = new Map();

  for (const market of markets) {
    const eventTicker = market?.eventTicker || "";
    const marketType = getMarketType(market?.ticker);
    const { dateCode, matchupCode } = parseEventParts(eventTicker);

    const key = eventTicker || market?.ticker;

    if (!grouped.has(key)) {
      grouped.set(key, {
        eventTicker,
        dateCode,
        matchupCode,
        gameMarket: null,
        spreadMarkets: [],
        totalMarkets: [],
        pointsMarkets: [],
        reboundMarkets: [],
        assistMarkets: [],
        threePointMarkets: [],
        futuresMarkets: [],
        otherMarkets: [],
      });
    }

    const bucket = grouped.get(key);

    if (marketType === "game") bucket.gameMarket = market;
    else if (marketType === "spread") bucket.spreadMarkets.push(market);
    else if (marketType === "total") bucket.totalMarkets.push(market);
    else if (marketType === "points") bucket.pointsMarkets.push(market);
    else if (marketType === "rebounds") bucket.reboundMarkets.push(market);
    else if (marketType === "assists") bucket.assistMarkets.push(market);
    else if (marketType === "threes") bucket.threePointMarkets.push(market);
    else if (marketType === "futures") bucket.futuresMarkets.push(market);
    else bucket.otherMarkets.push(market);
  }

  return Array.from(grouped.values());
}
