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
      <h3 className="panel-title">Filters</h3>

      <div className="filters-controls">
        <div className="filter-toggle-group">
          <span className="filter-group-label">Location</span>

          <button
            type="button"
            className={`filter-chip ${locations.includes("home") ? "active" : ""}`}
            onClick={() => onToggleLocation("home")}
          >
            Home
          </button>

          <button
            type="button"
            className={`filter-chip ${locations.includes("away") ? "active" : ""}`}
            onClick={() => onToggleLocation("away")}
          >
            Away
          </button>
        </div>

        <div className="filter-toggle-group">
          <span className="filter-group-label">Result</span>

          <button
            type="button"
            className={`filter-chip ${results.includes("win") ? "active" : ""}`}
            onClick={() => onToggleResult("win")}
          >
            Wins
          </button>

          <button
            type="button"
            className={`filter-chip ${results.includes("loss") ? "active" : ""}`}
            onClick={() => onToggleResult("loss")}
          >
            Losses
          </button>
        </div>

        <button
          type="button"
          className="filters-clear-button"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FiltersBar;
