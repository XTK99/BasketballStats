import { getConfidenceLevel } from "./getConfidenceLevel";

function getNumericValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getEdgeTier(edgePercent) {
  if (edgePercent >= 15) {
    return {
      label: "Strong Positive",
      tone: "strong-positive",
    };
  }

  if (edgePercent >= 7) {
    return {
      label: "Positive",
      tone: "positive",
    };
  }

  if (edgePercent <= -15) {
    return {
      label: "Strong Negative",
      tone: "strong-negative",
    };
  }

  if (edgePercent <= -7) {
    return {
      label: "Negative",
      tone: "negative",
    };
  }

  return {
    label: "Neutral",
    tone: "neutral",
  };
}

export function calculateMatchupSnapshot({
  games = [],
  statKey,
  line,
  opponentFilter = "",
}) {
  if (!games.length || !statKey) return null;

  const normalizedOpponentFilter = normalizeText(opponentFilter);

  const allStatValues = games
    .map((game) => getNumericValue(game?.[statKey]))
    .filter((value) => value !== null);

  const overallAverage = average(allStatValues);

  const matchupGames = normalizedOpponentFilter
    ? games.filter(
        (game) => normalizeText(game.opponent) === normalizedOpponentFilter,
      )
    : games;

  if (!matchupGames.length) {
    const confidence = getConfidenceLevel(0);

    return {
      opponent: opponentFilter || "All Opponents",
      gamesCount: 0,
      average: 0,
      overallAverage,
      edgeValue: 0,
      edgePercent: 0,
      edgeLabel: "Neutral",
      edgeTone: "neutral",
      hitRate: 0,
      hits: 0,
      total: 0,
      lastMatchupValue: null,
      lastMatchupDate: "",
      hasLine: false,
      confidenceLabel: confidence.label,
      confidenceTone: confidence.tone,
    };
  }

  const statValues = matchupGames
    .map((game) => getNumericValue(game?.[statKey]))
    .filter((value) => value !== null);

  const matchupAverage = average(statValues);
  const edgeValue = matchupAverage - overallAverage;
  const edgePercent =
    overallAverage !== 0 ? (edgeValue / overallAverage) * 100 : 0;

  const edgeTier = getEdgeTier(edgePercent);

  const numericLine = Number(line);
  const hasLine = Number.isFinite(numericLine);

  const hits = hasLine
    ? matchupGames.filter((game) => {
        const value = getNumericValue(game?.[statKey]);
        return value !== null && value >= numericLine;
      }).length
    : 0;

  const hitRate =
    hasLine && matchupGames.length ? (hits / matchupGames.length) * 100 : 0;

  const lastMatchup = matchupGames[0] || null;
  const lastMatchupValue = lastMatchup
    ? getNumericValue(lastMatchup?.[statKey])
    : null;
  const confidence = getConfidenceLevel(matchupGames.length);

  return {
    opponent: normalizedOpponentFilter
      ? matchupGames[0]?.opponent || opponentFilter
      : "All Opponents",
    gamesCount: matchupGames.length,
    average: matchupAverage,
    overallAverage,
    edgeValue,
    edgePercent,
    edgeLabel: edgeTier.label,
    edgeTone: edgeTier.tone,
    hitRate,
    hits,
    total: matchupGames.length,
    lastMatchupValue,
    lastMatchupDate: lastMatchup?.gameDate || "",
    hasLine,
    confidenceLabel: confidence.label,
    confidenceTone: confidence.tone,
  };
}
