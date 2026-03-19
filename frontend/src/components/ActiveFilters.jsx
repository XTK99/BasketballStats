function ActiveFilters({
  locationFilter,
  resultFilter,
  opponentFilter,
  thresholdFilters,
  onRemoveLocationFilter,
  onRemoveResultFilter,
  onRemoveOpponentFilter,
  onRemoveThresholdFilter,
}) {
  const filterChips = [];

  if (locationFilter !== "all") {
    filterChips.push({
      key: "location",
      label: `Location: ${locationFilter}`,
      onRemove: onRemoveLocationFilter,
    });
  }

  if (resultFilter !== "all") {
    filterChips.push({
      key: "result",
      label: `Result: ${resultFilter}`,
      onRemove: onRemoveResultFilter,
    });
  }

  if (opponentFilter.trim()) {
    filterChips.push({
      key: "opponent",
      label: `Opponent: ${opponentFilter.toUpperCase()}`,
      onRemove: onRemoveOpponentFilter,
    });
  }

  thresholdFilters.forEach((filter, index) => {
    filterChips.push({
      key: `${filter.stat}-${filter.operator}-${filter.value}-${index}`,
      label: `${filter.stat} ${filter.operator} ${filter.value}`,
      onRemove: () => onRemoveThresholdFilter(index),
    });
  });

  if (filterChips.length === 0) {
    return null;
  }

  return (
    <section className="panel-card">
      <h3 className="panel-title">Active Filters</h3>

      <div className="active-filters">
        {filterChips.map((chip) => (
          <span key={chip.key} className="filter-pill">
            {chip.label}
            <button
              type="button"
              className="filter-pill-remove"
              onClick={chip.onRemove}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

export default ActiveFilters;
