import "./FiltersBar.css";

function FiltersBar({
  locations = [],
  results = [],
  onToggleLocation,
  onToggleResult,
  onClearFilters,
}) {
  return (
    <div className="filters-bar">
      <div className="filters-bar-header">
        <h3 className="panel-title">Filters</h3>

        <button
          type="button"
          className="filters-clear-button"
          onClick={onClearFilters}
        >
          Clear All
        </button>
      </div>

      <div className="filters-groups-grid">
        <div className="filter-toggle-group">
          <span className="filter-group-label">Location</span>

          <div className="filter-chip-row">
            <button
              type="button"
              className={`filter-chip ${
                locations.includes("home") ? "active" : ""
              }`}
              onClick={() => onToggleLocation("home")}
            >
              Home
            </button>

            <button
              type="button"
              className={`filter-chip ${
                locations.includes("away") ? "active" : ""
              }`}
              onClick={() => onToggleLocation("away")}
            >
              Away
            </button>
          </div>
        </div>

        <div className="filter-toggle-group">
          <span className="filter-group-label">Result</span>

          <div className="filter-chip-row">
            <button
              type="button"
              className={`filter-chip ${
                results.includes("win") ? "active" : ""
              }`}
              onClick={() => onToggleResult("win")}
            >
              Wins
            </button>

            <button
              type="button"
              className={`filter-chip ${
                results.includes("loss") ? "active" : ""
              }`}
              onClick={() => onToggleResult("loss")}
            >
              Losses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersBar;
