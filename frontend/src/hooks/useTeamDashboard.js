import { useMemo } from "react";
import { filterGames } from "../utils/filterGames";
import { calculateFilteredAverages } from "../utils/calculateFilteredAverages";
import { calculatePropInsights } from "../utils/calculatePropInsights";
import { calculateMatchupSnapshot } from "../utils/calculateMatchupSnapshot";

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

export function useTeamDashboard({ teamGames = [], filters, selectedStat }) {
  const filteredGames = useMemo(() => {
    return filterGames(teamGames, filters);
  }, [teamGames, filters]);

  const averages = useMemo(() => {
    return calculateFilteredAverages(filteredGames);
  }, [filteredGames]);

  const activeStatThreshold = useMemo(() => {
    return filters.thresholds.find((filter) => {
      const filterStatKey = String(getThresholdStatKey(filter)).toLowerCase();
      return filterStatKey === String(selectedStat).toLowerCase();
    });
  }, [filters.thresholds, selectedStat]);

  const selectedLine = useMemo(() => {
    if (!activeStatThreshold) return NaN;
    return getThresholdValue(activeStatThreshold);
  }, [activeStatThreshold]);

  const propInsights = useMemo(() => {
    if (!Number.isFinite(selectedLine)) return null;

    return calculatePropInsights({
      games: filteredGames,
      statKey: selectedStat,
      line: selectedLine,
    });
  }, [filteredGames, selectedStat, selectedLine]);

  const matchupOpponent = filters.opponent || "";

  const matchupSnapshot = useMemo(() => {
    return calculateMatchupSnapshot({
      games: teamGames,
      statKey: selectedStat,
      line: selectedLine,
      opponentFilter: matchupOpponent,
    });
  }, [teamGames, selectedStat, selectedLine, matchupOpponent]);

  return {
    filteredGames,
    averages,
    selectedLine,
    propInsights,
    matchupSnapshot,
    matchupOpponent,
  };
}
