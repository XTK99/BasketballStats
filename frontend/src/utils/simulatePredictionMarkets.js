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

function getSimpleModelProbability({ statValue, line, marketType }) {
  if (!Number.isFinite(statValue) || !Number.isFinite(line)) {
    return 0.5;
  }

  const diff = marketType === "over" ? statValue - line : line - statValue;

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
  side,
  ignoreMissedGames,
}) {
  const safeGames = Array.isArray(games) ? games : [];

  if (safeGames.length === 0) {
    return {
      summary: {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        totalCost: 0,
        totalPnl: 0,
        roiPercent: 0,
        avgEdgePercent: 0,
      },
      results: [],
    };
  }
  const numericLine = Number(line);
  const fallbackYesPrice = clampPrice(Number(yesPrice));
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

    const rowYesPrice = clampPrice(
      Number(game?.entryYesPrice ?? game?.yesPrice ?? fallbackYesPrice),
    );

    const marketProbability = getImpliedProbabilityFromPrice(rowYesPrice);

    const modelProbability = getSimpleModelProbability({
      statValue,
      line: numericLine,
      marketType,
    });

    const outcome = getMarketOutcome({
      statValue,
      line: numericLine,
      marketType,
    });

    const entryPrice = side === "yes" ? rowYesPrice : 1 - rowYesPrice;
    const cost = getContractCost(entryPrice, numericContracts);
    const payout = getMaxPayout(numericContracts);

    const pnl = getRealizedPnl({
      side,
      yesPrice: rowYesPrice,
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
      yesPrice: rowYesPrice,
      noPrice: Number((1 - rowYesPrice).toFixed(2)),
      entryYesPrice: rowYesPrice,
      priceTimestamp: game.priceTimestamp ?? null,
      marketTicker: game.marketTicker ?? null,
      marketProbability,
      modelProbability,
      edgePercent: getEdgePercent(modelProbability, marketProbability),
      contracts: numericContracts,
      cost: Number(cost.toFixed(2)),
      payout: Number(payout.toFixed(2)),
      pnl: Number(pnl.toFixed(2)),
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
