function calculateAverages(games) {
  if (!games.length) {
    return {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
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
      return acc;
    },
    {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
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
  };
}

module.exports = { calculateAverages };
