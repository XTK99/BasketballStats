function calculateTeamAverages(games) {
  if (!games.length) {
    return {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fieldGoalPct: 0,
      threePointPct: 0,
      freeThrowPct: 0,
    };
  }

  const totals = games.reduce(
    (acc, game) => {
      acc.points += Number(game.points) || 0;
      acc.rebounds += Number(game.rebounds) || 0;
      acc.assists += Number(game.assists) || 0;
      acc.steals += Number(game.steals) || 0;
      acc.blocks += Number(game.blocks) || 0;
      acc.turnovers += Number(game.turnovers) || 0;
      acc.fieldGoalPct += Number(game.fieldGoalPct) || 0;
      acc.threePointPct += Number(game.threePointPct) || 0;
      acc.freeThrowPct += Number(game.freeThrowPct) || 0;
      return acc;
    },
    {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fieldGoalPct: 0,
      threePointPct: 0,
      freeThrowPct: 0,
    },
  );

  const count = games.length;

  return {
    points: +(totals.points / count).toFixed(1),
    rebounds: +(totals.rebounds / count).toFixed(1),
    assists: +(totals.assists / count).toFixed(1),
    steals: +(totals.steals / count).toFixed(1),
    blocks: +(totals.blocks / count).toFixed(1),
    turnovers: +(totals.turnovers / count).toFixed(1),
    fieldGoalPct: +(totals.fieldGoalPct / count).toFixed(3),
    threePointPct: +(totals.threePointPct / count).toFixed(3),
    freeThrowPct: +(totals.freeThrowPct / count).toFixed(3),
  };
}

module.exports = { calculateTeamAverages };
