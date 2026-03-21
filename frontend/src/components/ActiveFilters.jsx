import "./ActiveFilters.css";

function ActiveFilters({
  locationFilter,
  resultFilter,
  opponentFilter,
  thresholdFilters,
  onRemoveThresholdFilter,
}) {
  const normalFilters = [];

  if (locationFilter !== "all") {
    normalFilters.push({ label: `Location: ${locationFilter}` });
  }

  if (resultFilter !== "all") {
    normalFilters.push({ label: `Result: ${resultFilter}` });
  }

  if (opponentFilter.trim()) {
    normalFilters.push({ label: `Opponent: ${opponentFilter.trim()}` });
  }

  const hasFilters = normalFilters.length > 0 || thresholdFilters.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="active-filters-panel">
      <h3 className="panel-title">Active Filters</h3>

      <div className="active-filters-list">
        {normalFilters.map((filter) => (
          <div key={filter.label} className="filter-pill">
            <span className="filter-pill-label">{filter.label}</span>
          </div>
        ))}

        {thresholdFilters.map((filter, index) => (
          <div
            key={`${filter.stat}-${filter.operator}-${filter.value}-${index}`}
            className="filter-pill"
          >
            <span className="filter-pill-label">
              {filter.stat} {filter.operator} {filter.value}
            </span>

            <button
              className="filter-pill-remove"
              onClick={() => onRemoveThresholdFilter(index)}
              aria-label={`Remove ${filter.stat} ${filter.operator} ${filter.value}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveFilters;
