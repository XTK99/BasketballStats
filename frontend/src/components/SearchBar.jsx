function SearchBar({
  mode,
  searchValue,
  setSearchValue,
  last,
  setLast,
  onSearch,
  loading,
  onUseFullSeason,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-row" onSubmit={handleSubmit}>
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
        disabled={loading}
      >
        Full Season
      </button>

      <button type="submit" className="search-button" disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
