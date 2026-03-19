export function clampPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) return 0.5;

  return Math.min(0.99, Math.max(0.01, numericPrice));
}

export function getImpliedProbabilityFromPrice(price) {
  return clampPrice(price);
}

export function getNoPriceFromYesPrice(yesPrice) {
  return Number((1 - clampPrice(yesPrice)).toFixed(2));
}

export function getContractCost(price, contracts) {
  return clampPrice(price) * Number(contracts || 0);
}

export function getMaxPayout(contracts) {
  return Number(contracts || 0);
}

export function getMaxProfit(price, contracts) {
  const cost = getContractCost(price, contracts);
  const payout = getMaxPayout(contracts);
  return payout - cost;
}

export function getRealizedPnl({ side, yesPrice, contracts, outcome }) {
  const safeYesPrice = clampPrice(yesPrice);
  const safeContracts = Number(contracts || 0);

  const entryPrice = side === "yes" ? safeYesPrice : 1 - safeYesPrice;
  const cost = entryPrice * safeContracts;

  const isWin =
    (side === "yes" && outcome === "yes") ||
    (side === "no" && outcome === "no");

  const payout = isWin ? safeContracts : 0;

  return Number((payout - cost).toFixed(2));
}

export function getRoiPercent(pnl, cost) {
  if (!cost) return 0;
  return (Number(pnl) / Number(cost)) * 100;
}

export function getEdgePercent(modelProbability, marketProbability) {
  return (Number(modelProbability) - Number(marketProbability)) * 100;
}
