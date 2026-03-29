import "./ActiveFilters.css";

function formatFilterLabel(value) {
  return String(value || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function ActiveFilters({
  locations = [],
  results = [],
  thresholdFilters = [],
  onRemoveThresholdFilter,
}) {
  const normalFilters = [];

  const allLocationsSelected =
    locations.includes("home") && locations.includes("away");

  const allResultsSelected =
    results.includes("win") && results.includes("loss");

  if (!allLocationsSelected) {
    normalFilters.push({
      label: `Location: ${locations.join(", ") || "none"}`,
    });
  }

  if (!allResultsSelected) {
    normalFilters.push({
      label: `Result: ${results.join(", ") || "none"}`,
    });
  }

  const hasFilters = normalFilters.length > 0 || thresholdFilters.length > 0;

  if (!hasFilters) return null;

  return (
    <section className="active-filters-section">
      <div className="active-filters">
        {normalFilters.map((filter, index) => (
          <span key={index} className="active-filter-pill">
            {filter.label}
          </span>
        ))}

        {thresholdFilters.map((filter, index) => (
          <button
            key={`${filter.stat}-${filter.operator}-${filter.value}-${index}`}
            type="button"
            className="active-filter-pill active-filter-pill-button"
            onClick={() => onRemoveThresholdFilter(index)}
            title="Remove filter"
          >
            <span className="active-filter-pill-text">
              {formatFilterLabel(filter.stat)} {filter.operator} {filter.value}
            </span>
            <span className="active-filter-remove" aria-hidden="true">
              ×
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ActiveFilters;
