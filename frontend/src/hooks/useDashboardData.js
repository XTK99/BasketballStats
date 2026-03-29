import { useMemo } from "react";
import { normalizeGames } from "../utils/normalizeGames";
import { mergePlayerGamesWithTeamGames } from "../utils/mergePlayerGamesWithTeamGames";
import { calculateHitRateBoard } from "../utils/calculateHitRateBoard";
import { generateThresholds } from "../utils/generateThresholds";

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function matchesOperator(statValue, operator, targetValue) {
  const left = toNumber(statValue, null);
  const right = toNumber(targetValue, null);

  if (left === null || right === null) return false;

  switch (operator) {
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "=":
    case "==":
      return left === right;
    default:
      return true;
  }
}

function getGameStatValue(game, statKey) {
  if (!game || !statKey) return 0;
  return toNumber(game[statKey], 0);
}

function isWin(game) {
  if (typeof game?.win === "boolean") return game.win;
  if (typeof game?.isWin === "boolean") return game.isWin;

  const result = String(game?.result || game?.wl || "").toLowerCase();
  if (result === "win" || result === "w") return true;
  if (result === "loss" || result === "l") return false;

  return false;
}

function isLoss(game) {
  if (typeof game?.win === "boolean") return !game.win;
  if (typeof game?.isWin === "boolean") return !game.isWin;

  const result = String(game?.result || game?.wl || "").toLowerCase();
  if (result === "loss" || result === "l") return true;
  if (result === "win" || result === "w") return false;

  return false;
}

function applyGameFilters(games, filters = {}) {
  return games.filter((game) => {
    const {
      locations = ["home", "away"],
      results = ["win", "loss"],
      opponent = "",
      thresholds = [],
    } = filters;

    const homeEnabled = locations.includes("home");
    const awayEnabled = locations.includes("away");

    if (game.isHome === true && !homeEnabled) return false;
    if (game.isHome === false && !awayEnabled) return false;

    const winsEnabled = results.includes("win");
    const lossesEnabled = results.includes("loss");

    if (!winsEnabled && isWin(game)) return false;
    if (!lossesEnabled && isLoss(game)) return false;

    if (opponent) {
      const gameOpponent = String(game.opponent || "").toLowerCase();
      const wantedOpponent = String(opponent).toLowerCase();
      if (gameOpponent !== wantedOpponent) return false;
    }

    if (Array.isArray(thresholds) && thresholds.length > 0) {
      for (const threshold of thresholds) {
        const statValue = getGameStatValue(game, threshold.stat);
        const passed = matchesOperator(
          statValue,
          threshold.operator,
          threshold.value,
        );
        if (!passed) return false;
      }
    }

    return true;
  });
}
function buildChartData(games, selectedStat, includeMissedGames = false) {
  return games.map((game, index) => {
    const played = game.played !== false;
    const statValue = played
      ? getGameStatValue(game, selectedStat)
      : includeMissedGames
        ? 0
        : null;

    return {
      index,
      gameId: game.gameId,
      gameDate: game.gameDate,
      matchup: game.matchup,
      opponent: game.opponent,
      win: isWin(game),
      isHome: game.isHome,
      played,
      value: statValue,
      finalScore: game.finalScore || "",
      rawGame: game,
    };
  });
}

function buildAverages(games) {
  const playedGames = games.filter((game) => game.played !== false);

  if (!playedGames.length) {
    return {
      points: "0.0",
      rebounds: "0.0",
      assists: "0.0",
      steals: "0.0",
      blocks: "0.0",
      turnovers: "0.0",
      threesMade: "0.0",
      minutes: "0.0",
    };
  }

  const totals = {
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    threesMade: 0,
    minutes: 0,
  };

  for (const game of playedGames) {
    totals.points += toNumber(game.points, 0);
    totals.rebounds += toNumber(game.rebounds, 0);
    totals.assists += toNumber(game.assists, 0);
    totals.steals += toNumber(game.steals, 0);
    totals.blocks += toNumber(game.blocks, 0);
    totals.turnovers += toNumber(game.turnovers, 0);
    totals.threesMade += toNumber(game.threesMade, 0);
    totals.minutes += toNumber(game.minutes, 0);
  }

  const count = playedGames.length;

  return {
    points: (totals.points / count).toFixed(1),
    rebounds: (totals.rebounds / count).toFixed(1),
    assists: (totals.assists / count).toFixed(1),
    steals: (totals.steals / count).toFixed(1),
    blocks: (totals.blocks / count).toFixed(1),
    turnovers: (totals.turnovers / count).toFixed(1),
    threesMade: (totals.threesMade / count).toFixed(1),
    minutes: (totals.minutes / count).toFixed(1),
  };
}

function buildSummary(games, filteredGames, selectedStat) {
  const playedGames = games.filter((game) => game.played !== false);
  const filteredPlayedGames = filteredGames.filter(
    (game) => game.played !== false,
  );

  const averageSelectedStat =
    filteredPlayedGames.length > 0
      ? (
          filteredPlayedGames.reduce(
            (sum, game) => sum + getGameStatValue(game, selectedStat),
            0,
          ) / filteredPlayedGames.length
        ).toFixed(1)
      : "0.0";

  return {
    loadedGames: games.length,
    filteredCount: filteredGames.length,
    playedCount: playedGames.length,
    filteredPlayedCount: filteredPlayedGames.length,
    filteredPercent:
      games.length > 0
        ? ((filteredGames.length / games.length) * 100).toFixed(1)
        : "0.0",
    averageSelectedStat,
    averages: buildAverages(filteredGames),
  };
}

function buildSplits(games, selectedStat) {
  function avg(list) {
    const played = list.filter((game) => game.played !== false);
    if (!played.length) return "0.0";

    const total = played.reduce(
      (sum, game) => sum + getGameStatValue(game, selectedStat),
      0,
    );

    return (total / played.length).toFixed(1);
  }

  const homeGames = games.filter((game) => game.isHome === true);
  const awayGames = games.filter((game) => game.isHome === false);
  const wins = games.filter((game) => isWin(game));
  const losses = games.filter((game) => isLoss(game));

  return {
    home: {
      count: homeGames.length,
      avg: avg(homeGames),
    },
    away: {
      count: awayGames.length,
      avg: avg(awayGames),
    },
    wins: {
      count: wins.length,
      avg: avg(wins),
    },
    losses: {
      count: losses.length,
      avg: avg(losses),
    },
  };
}

export function useDashboardData({
  mode,
  rawPlayerGames = [],
  rawTeamGames = [],
  filters = {},
  selectedStat = "points",
  includeMissedGames = false,
}) {
  const normalizedPlayerGames = useMemo(() => {
    if (mode !== "player") return [];
    return normalizeGames(rawPlayerGames || []);
  }, [mode, rawPlayerGames]);

  const normalizedTeamGames = useMemo(() => {
    return normalizeGames(rawTeamGames || []);
  }, [rawTeamGames]);

  const seasonTimelineGames = useMemo(() => {
    if (mode === "player") {
      return mergePlayerGamesWithTeamGames(
        normalizedPlayerGames,
        normalizedTeamGames,
      );
    }
    return normalizedTeamGames;
  }, [mode, normalizedPlayerGames, normalizedTeamGames]);

  const filteredGames = useMemo(() => {
    return applyGameFilters(seasonTimelineGames, filters);
  }, [seasonTimelineGames, filters]);

  const chartData = useMemo(() => {
    const sourceGames = includeMissedGames
      ? seasonTimelineGames
      : seasonTimelineGames.filter((game) => game.played !== false);

    return buildChartData(sourceGames, selectedStat, includeMissedGames);
  }, [seasonTimelineGames, selectedStat, includeMissedGames]);

  const summary = useMemo(() => {
    return buildSummary(seasonTimelineGames, filteredGames, selectedStat);
  }, [seasonTimelineGames, filteredGames, selectedStat]);

  const splits = useMemo(() => {
    return buildSplits(filteredGames, selectedStat);
  }, [filteredGames, selectedStat]);

  const hitRateBoard = useMemo(() => {
    try {
      const playedFilteredGames = filteredGames.filter(
        (game) => game.played !== false,
      );
      const thresholds = generateThresholds(selectedStat);

      return calculateHitRateBoard({
        games: playedFilteredGames,
        stat: selectedStat,
        thresholds,
      });
    } catch (error) {
      console.error("calculateHitRateBoard failed:", error);
      return [];
    }
  }, [filteredGames, selectedStat]);

  const averages = summary.averages;

  return {
    games: seasonTimelineGames,
    filteredGames,
    chartData,
    summary,
    averages,
    splits,
    hitRateBoard,
    selectedLine: null,
    propInsights: null,
    raw: {
      normalizedPlayerGames,
      normalizedTeamGames,
      seasonTimelineGames,
    },
  };
}
