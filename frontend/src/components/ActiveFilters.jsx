function ActiveFilters({
  locationFilter,
  resultFilter,
  opponentFilter,
  thresholdFilters,
  onRemoveThresholdFilter,
}) {
  const normalFilters = [];

  if (locationFilter !== "all") {
    normalFilters.push(`Location: ${locationFilter}`);
  }

  if (resultFilter !== "all") {
    normalFilters.push(`Result: ${resultFilter}`);
  }

  if (opponentFilter.trim()) {
    normalFilters.push(`Opponent: ${opponentFilter}`);
  }

  if (normalFilters.length === 0 && thresholdFilters.length === 0) {
    return null;
  }

  return (
    <section className="panel-card">
      <h3 className="panel-title">Active Filters</h3>

      <div className="active-filters">
        {normalFilters.map((filter) => (
          <span key={filter} className="filter-pill">
            {filter}
          </span>
        ))}

        {thresholdFilters.map((filter, index) => (
          <span
            key={`${filter.stat}-${filter.operator}-${filter.value}-${index}`}
            className="filter-pill"
          >
            {filter.stat} {filter.operator} {filter.value}
            <button
              type="button"
              className="filter-pill-remove"
              onClick={() => onRemoveThresholdFilter(index)}
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
