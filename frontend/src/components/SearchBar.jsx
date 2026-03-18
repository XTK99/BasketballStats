function SearchBar({
  mode,
  searchValue,
  setSearchValue,
  last,
  setLast,
  handleSearch,
  loading,
  fullSeasonCount,
  onUseFullSeason,
}) {
  return (
    <div className="search-row">
      <input
        className="search-input"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={mode === "player" ? "Search player..." : "Search team..."}
      />

      <div className="last-games-group">
        <label className="last-games-label" htmlFor="last-games-input">
          Last
        </label>
        <input
          id="last-games-input"
          className="search-number last-games-input"
          type="number"
          min="1"
          value={last}
          onChange={(e) => setLast(Number(e.target.value) || 1)}
        />
      </div>

      <button
        type="button"
        className="secondary-button full-season-button"
        onClick={onUseFullSeason}
        disabled={!fullSeasonCount}
      >
        Full Season
      </button>

      <button
        className="search-button"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;
