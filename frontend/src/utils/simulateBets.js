function getProfitFromAmericanOdds(stake, odds) {
  const numericOdds = Number(odds);

  if (!Number.isFinite(numericOdds) || numericOdds === 0) {
    return 0;
  }

  if (numericOdds > 0) {
    return (stake * numericOdds) / 100;
  }

  return (stake * 100) / Math.abs(numericOdds);
}

function getOutcome(statValue, line, betType) {
  if (betType === "over") {
    if (statValue > line) return "win";
    if (statValue === line) return "push";
    return "loss";
  }

  if (statValue < line) return "win";
  if (statValue === line) return "push";
  return "loss";
}

export function simulateBets({
  games,
  statKey,
  line,
  betType,
  stake,
  odds,
  startingBankroll = 100,
  ignoreMissedGames = true,
}) {
  const safeGames = Array.isArray(games) ? games : [];
  const numericLine = Number(line);
  const numericStake = Number(stake);
  const numericOdds = Number(odds);

  let bankroll = Number(startingBankroll) || 0;
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  let totalProfit = 0;
  let totalWagered = 0;

  const results = [];

  for (const game of safeGames) {
    const minutes = Number(game.minutes ?? 0);
    const missedGame =
      game.didNotPlay === true ||
      game.didNotDress === true ||
      game.notWithTeam === true ||
      minutes <= 0;

    if (ignoreMissedGames && missedGame) {
      continue;
    }

    const statValue = Number(game?.[statKey] ?? 0);
    const outcome = getOutcome(statValue, numericLine, betType);

    let profit = 0;

    if (outcome === "win") {
      profit = getProfitFromAmericanOdds(numericStake, numericOdds);
      wins += 1;
      totalWagered += numericStake;
    } else if (outcome === "loss") {
      profit = -numericStake;
      losses += 1;
      totalWagered += numericStake;
    } else {
      profit = 0;
      pushes += 1;
    }

    bankroll += profit;
    totalProfit += profit;

    results.push({
      gameId: game.gameId,
      date: game.gameDate,
      matchup: game.matchup,
      opponent: game.opponent,
      statValue,
      line: numericLine,
      betType,
      outcome,
      stake: numericStake,
      odds: numericOdds,
      profit,
      bankrollAfter: bankroll,
    });
  }

  const gradedBets = wins + losses;
  const winRate = gradedBets > 0 ? (wins / gradedBets) * 100 : 0;
  const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0;

  return {
    summary: {
      wins,
      losses,
      pushes,
      gradedBets,
      totalBets: results.length,
      totalWagered,
      totalProfit,
      winRate,
      roi,
      startingBankroll: Number(startingBankroll) || 0,
      endingBankroll: bankroll,
    },
    results,
  };
}
