import "./FiltersBar.css";

function FiltersBar({
  locationFilter,
  setLocationFilter,
  resultFilter,
  setResultFilter,
  opponentFilter,
  setOpponentFilter,
}) {
  function handleClearFilters() {
    setLocationFilter("all");
    setResultFilter("all");
    setOpponentFilter("");
  }

  return (
    <div className="filters-bar">
      <h3 className="panel-title">Filters</h3>

      <div className="filters-controls">
        <select
          className="filters-select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="home">Home</option>
          <option value="away">Away</option>
        </select>

        <select
          className="filters-select"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="all">All Results</option>
          <option value="win">Wins</option>
          <option value="loss">Losses</option>
        </select>

        <input
          className="filters-input"
          type="text"
          value={opponentFilter}
          onChange={(e) => setOpponentFilter(e.target.value)}
          placeholder="Filter by opponent (ex: DEN)"
        />

        <button className="filters-clear-button" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FiltersBar;
