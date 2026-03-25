import { useMemo } from "react";
import { calculatePropInsights } from "../utils/calculatePropInsights";
import { calculateMatchupSnapshot } from "../utils/calculateMatchupSnapshot";
import { filterGames } from "../utils/filterGames";
import { calculateFilteredAverages } from "../utils/calculateFilteredAverages";
import { buildPlayerSeasonGames } from "../utils/playerDashboard/buildPlayerSeasonGames";
import { getGameMinutes } from "../utils/playerDashboard/getGameMinutes";

function getThresholdStatKey(filter) {
  return (
    filter?.stat || filter?.selectedStat || filter?.key || filter?.field || ""
  );
}

function getThresholdValue(filter) {
  const rawValue =
    filter?.value ??
    filter?.line ??
    filter?.threshold ??
    filter?.target ??
    null;

  const num = Number(rawValue);
  return Number.isFinite(num) ? num : NaN;
}

export function usePlayerDashboard({
  playerGames = [],
  teamGames = [],
  filters = { locations: [], results: [], opponent: "", thresholds: [] },
  selectedStat,
  includeMissedGames,
  selectedGame,
}) {
  const hasTeamGames = Array.isArray(teamGames) && teamGames.length > 0;
  const safeThresholds = Array.isArray(filters?.thresholds)
    ? filters.thresholds
    : [];

  const playerSeasonGames = useMemo(() => {
    if (hasTeamGames) {
      return buildPlayerSeasonGames(teamGames, playerGames);
    }

    return playerGames;
  }, [hasTeamGames, teamGames, playerGames]);

  const filteredPlayerGames = useMemo(() => {
    return filterGames(playerSeasonGames, {
      ...filters,
      thresholds: safeThresholds,
    });
  }, [playerSeasonGames, filters, safeThresholds]);

  const playedPlayerGames = useMemo(() => {
    return filteredPlayerGames.filter((game) => getGameMinutes(game) > 0);
  }, [filteredPlayerGames]);

  const effectivePlayerGames = useMemo(() => {
    return includeMissedGames ? filteredPlayerGames : playedPlayerGames;
  }, [includeMissedGames, filteredPlayerGames, playedPlayerGames]);

  const playerSampleTeamGames = useMemo(() => {
    if (!hasTeamGames) {
      return [];
    }

    return filterGames(teamGames, {
      locations: filters?.locations,
      results: filters?.results,
      opponent: filters?.opponent,
      thresholds: [],
    });
  }, [hasTeamGames, teamGames, filters]);

  const averages = useMemo(() => {
    return calculateFilteredAverages(effectivePlayerGames);
  }, [effectivePlayerGames]);

  const seasonPlayedCount = useMemo(() => {
    return playerGames.filter((game) => getGameMinutes(game) > 0).length;
  }, [playerGames]);

  const seasonGamesCount = hasTeamGames ? teamGames.length : playerGames.length;

  const seasonMissedCount = useMemo(() => {
    return hasTeamGames ? Math.max(0, seasonGamesCount - seasonPlayedCount) : 0;
  }, [hasTeamGames, seasonGamesCount, seasonPlayedCount]);

  const playedGamesCount = playedPlayerGames.length;
  const sampleGamesCount = hasTeamGames
    ? playerSampleTeamGames.length
    : playerGames.length;

  const activeStatThreshold = useMemo(() => {
    return safeThresholds.find((filter) => {
      const filterStatKey = String(getThresholdStatKey(filter)).toLowerCase();
      return filterStatKey === String(selectedStat).toLowerCase();
    });
  }, [safeThresholds, selectedStat]);

  const selectedLine = useMemo(() => {
    if (!activeStatThreshold) return NaN;
    return getThresholdValue(activeStatThreshold);
  }, [activeStatThreshold]);

  const hitsPlayedCount = useMemo(() => {
    if (!Number.isFinite(selectedLine)) return 0;

    return playedPlayerGames.filter((game) => {
      const value = Number(game?.[selectedStat]);
      return Number.isFinite(value) && value >= selectedLine;
    }).length;
  }, [playedPlayerGames, selectedStat, selectedLine]);

  const hitsSeasonCount = useMemo(() => {
    if (!Number.isFinite(selectedLine)) return 0;

    if (hasTeamGames) {
      return hitsPlayedCount;
    }

    return effectivePlayerGames.filter((game) => {
      const value = Number(game?.[selectedStat]);
      return Number.isFinite(value) && value >= selectedLine;
    }).length;
  }, [
    hasTeamGames,
    hitsPlayedCount,
    effectivePlayerGames,
    selectedStat,
    selectedLine,
  ]);

  const propInsights = useMemo(() => {
    if (!Number.isFinite(selectedLine)) return null;

    return calculatePropInsights({
      games: effectivePlayerGames,
      statKey: selectedStat,
      line: selectedLine,
    });
  }, [effectivePlayerGames, selectedStat, selectedLine]);

  const matchupOpponent = filters?.opponent || selectedGame?.opponent || "";

  const matchupSnapshot = useMemo(() => {
    return calculateMatchupSnapshot({
      games: playerGames,
      statKey: selectedStat,
      line: selectedLine,
      opponentFilter: matchupOpponent,
    });
  }, [playerGames, selectedStat, selectedLine, matchupOpponent]);

  return {
    matchupOpponent,
    filteredGames: effectivePlayerGames,
    allSeasonGames: playerSeasonGames,
    averages,
    selectedLine,
    propInsights,
    matchupSnapshot,
    counts: {
      playedGamesCount,
      sampleGamesCount,
      seasonPlayedCount,
      seasonMissedCount,
      hitsPlayedCount,
      hitsSeasonCount,
    },
  };
}
