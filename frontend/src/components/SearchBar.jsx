function SearchBar({
  mode,
  searchValue,
  setSearchValue,
  last,
  setLast,
  handleSearch,
  loading,
}) {
  return (
    <div className="search-row">
      <input
        className="search-input"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={
          mode === "player" ? "Enter player name" : "Enter team name"
        }
      />

      <input
        className="search-number"
        type="number"
        value={last}
        onChange={(e) => setLast(Number(e.target.value))}
        min="1"
        max="20"
      />

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
