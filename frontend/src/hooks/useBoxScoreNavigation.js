function buildBaseControls(config) {
  return {
    title: config.title,
    loading: config.loading,
    error: config.error,
    query: config.query,
    setQuery: config.setQuery,
    season: config.season,
    setSeason: config.setSeason,
    last: config.last,
    setLast: config.setLast,
    onSearch: config.onSearch,
    filters: config.filters,
    onUpdateFilter: config.onUpdateFilter,
    onRemoveThresholdFilter: config.onRemoveThresholdFilter,
    onToggleLocation: config.onToggleLocation,
    onToggleResult: config.onToggleResult,
    onClearFilters: config.onClearFilters,
    selectedStat: config.selectedStat,
    setSelectedStat: config.setSelectedStat,
  };
}

export function useDashboardControls({ playerConfig, teamConfig }) {
  const playerControls = {
    ...buildBaseControls(playerConfig),
    includeMissedGames: playerConfig.includeMissedGames,
    setIncludeMissedGames: playerConfig.setIncludeMissedGames,
  };

  const teamControls = buildBaseControls(teamConfig);

  return {
    playerControls,
    teamControls,
  };
}
