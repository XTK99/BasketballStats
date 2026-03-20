function normalizeLevelPrice(level) {
  if (!level) return null;

  // Example array format from docs-like responses:
  // ["0.4200", "13.00"]
  if (Array.isArray(level)) {
    const rawPrice = Number(level[0]);
    return Number.isFinite(rawPrice) ? rawPrice : null;
  }

  // Defensive support for object-style levels
  if (typeof level === "object") {
    if ("price_dollars" in level) {
      const rawPrice = Number(level.price_dollars);
      return Number.isFinite(rawPrice) ? rawPrice : null;
    }

    if ("price" in level) {
      const rawPrice = Number(level.price);
      if (!Number.isFinite(rawPrice)) return null;

      // If API returns cents like 58, convert to dollars.
      return rawPrice > 1 ? rawPrice / 100 : rawPrice;
    }
  }

  return null;
}

function normalizeLevels(levels) {
  if (!Array.isArray(levels)) return [];

  return levels
    .map((level) => normalizeLevelPrice(level))
    .filter((price) => Number.isFinite(price))
    .sort((a, b) => b - a);
}

export function getYesLevels(orderbook) {
  return normalizeLevels(
    orderbook?.yes ??
      orderbook?.yes_dollars ??
      orderbook?.orderbook?.yes ??
      orderbook?.orderbook?.yes_dollars ??
      [],
  );
}

export function getNoLevels(orderbook) {
  return normalizeLevels(
    orderbook?.no ??
      orderbook?.no_dollars ??
      orderbook?.orderbook?.no ??
      orderbook?.orderbook?.no_dollars ??
      [],
  );
}

export function getBestYesBid(orderbook) {
  const yesLevels = getYesLevels(orderbook);
  return yesLevels[0] ?? null;
}

export function getBestNoBid(orderbook) {
  const noLevels = getNoLevels(orderbook);
  return noLevels[0] ?? null;
}

export function getBestYesAsk(orderbook) {
  const bestNoBid = getBestNoBid(orderbook);
  return bestNoBid == null ? null : Number((1 - bestNoBid).toFixed(4));
}

export function getBestNoAsk(orderbook) {
  const bestYesBid = getBestYesBid(orderbook);
  return bestYesBid == null ? null : Number((1 - bestYesBid).toFixed(4));
}

export function getMidYesPrice(orderbook) {
  const yesBid = getBestYesBid(orderbook);
  const yesAsk = getBestYesAsk(orderbook);

  if (yesBid == null && yesAsk == null) return null;
  if (yesBid == null) return yesAsk;
  if (yesAsk == null) return yesBid;

  return Number(((yesBid + yesAsk) / 2).toFixed(4));
}

export function getEntryYesPrice(orderbook, side = "yes") {
  if (side === "yes") {
    return getBestYesAsk(orderbook) ?? getMidYesPrice(orderbook) ?? 0.5;
  }

  return getBestYesBid(orderbook) ?? getMidYesPrice(orderbook) ?? 0.5;
}

export function formatContractPrice(price) {
  if (!Number.isFinite(price)) return "--";
  return `${Math.round(price * 100)}¢`;
}

export function formatPercentFromPrice(price) {
  if (!Number.isFinite(price)) return "--";
  return `${(price * 100).toFixed(1)}%`;
}
