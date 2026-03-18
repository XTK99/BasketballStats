function FiltersBar({
  locationFilter,
  setLocationFilter,
  resultFilter,
  setResultFilter,
  opponentFilter,
  setOpponentFilter,
}) {
  return (
    <section className="panel-card">
      <h3 className="panel-title">Filters</h3>

      <div className="filters-row">
        <select
          className="search-select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="home">Home</option>
          <option value="away">Away</option>
        </select>

        <select
          className="search-select"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="all">All Results</option>
          <option value="wins">Wins</option>
          <option value="losses">Losses</option>
        </select>

        <input
          className="search-input"
          type="text"
          value={opponentFilter}
          onChange={(e) => setOpponentFilter(e.target.value)}
          placeholder="Filter by opponent (ex: DEN)"
        />
      </div>
    </section>
  );
}

export default FiltersBar;
