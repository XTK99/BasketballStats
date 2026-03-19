import {
  clampPrice,
  getImpliedProbabilityFromPrice,
  getContractCost,
  getMaxPayout,
  getRealizedPnl,
  getRoiPercent,
  getEdgePercent,
} from "./contractMath";

function getMarketOutcome({ statValue, line, marketType }) {
  if (marketType === "over") {
    return statValue > line ? "yes" : "no";
  }

  return statValue < line ? "yes" : "no";
}

function getSimpleModelProbability({ statValue, line }) {
  if (!Number.isFinite(statValue) || !Number.isFinite(line)) {
    return 0.5;
  }

  const diff = statValue - line;
  const scaled = 0.5 + diff * 0.03;

  return Math.min(0.95, Math.max(0.05, scaled));
}

export function simulatePredictionMarkets({
  games,
  statKey,
  line,
  marketType,
  yesPrice,
  contracts,
  side = "yes",
  ignoreMissedGames = true,
}) {
  const safeGames = Array.isArray(games) ? games : [];
  const numericLine = Number(line);
  const numericYesPrice = clampPrice(yesPrice);
  const numericContracts = Number(contracts || 0);

  let totalCost = 0;
  let totalPnl = 0;
  let wins = 0;
  let losses = 0;

  const results = [];

  for (const game of safeGames) {
    const missedGame =
      game.played === false ||
      game.didNotPlay === true ||
      Number(game.minutes ?? 0) <= 0;

    if (ignoreMissedGames && missedGame) {
      continue;
    }

    const statValue = Number(game?.[statKey] ?? 0);
    const marketProbability = getImpliedProbabilityFromPrice(numericYesPrice);
    const modelProbability = getSimpleModelProbability({
      statValue,
      line: numericLine,
    });

    const outcome = getMarketOutcome({
      statValue,
      line: numericLine,
      marketType,
    });

    const entryPrice = side === "yes" ? numericYesPrice : 1 - numericYesPrice;
    const cost = getContractCost(entryPrice, numericContracts);
    const payout = getMaxPayout(numericContracts);

    const pnl = getRealizedPnl({
      side,
      yesPrice: numericYesPrice,
      contracts: numericContracts,
      outcome,
    });

    if (pnl > 0) {
      wins += 1;
    } else {
      losses += 1;
    }

    totalCost += cost;
    totalPnl += pnl;

    results.push({
      gameId: game.gameId,
      date: game.gameDate,
      matchup: game.matchup,
      statValue,
      line: numericLine,
      marketType,
      marketQuestion:
        marketType === "over"
          ? `Over ${numericLine} ${statKey}`
          : `Under ${numericLine} ${statKey}`,
      side,
      yesPrice: numericYesPrice,
      noPrice: Number((1 - numericYesPrice).toFixed(2)),
      marketProbability,
      modelProbability,
      edgePercent: getEdgePercent(modelProbability, marketProbability),
      contracts: numericContracts,
      cost: Number(cost.toFixed(2)),
      payout: Number(payout.toFixed(2)),
      pnl,
      roiPercent: getRoiPercent(pnl, cost),
      outcome,
    });
  }

  const avgEdgePercent =
    results.length > 0
      ? results.reduce((sum, row) => sum + row.edgePercent, 0) / results.length
      : 0;

  const roiPercent = getRoiPercent(totalPnl, totalCost);

  return {
    summary: {
      totalTrades: results.length,
      wins,
      losses,
      totalCost: Number(totalCost.toFixed(2)),
      totalPnl: Number(totalPnl.toFixed(2)),
      roiPercent: Number(roiPercent.toFixed(2)),
      avgEdgePercent: Number(avgEdgePercent.toFixed(2)),
    },
    results,
  };
}
