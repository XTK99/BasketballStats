import "./SearchBar.css";

function SearchBar({
  mode,
  searchValue,
  setSearchValue,
  season,
  setSeason,
  last,
  setLast,
  onSearch,
  showSearchButton = true,
}) {
  function handleSubmit() {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) return;
    onSearch(trimmedValue);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="searchbar">
      <div className="search-input-wrap">
        <input
          className="search-input"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "player" ? "Search player..." : "Search team..."
          }
        />
      </div>

      <select
        className="search-select"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
      >
        <option value="2025-26">2025-26</option>
        <option value="2024-25">2024-25</option>
      </select>

      <select
        className="search-select"
        value={last}
        onChange={(e) => setLast(Number(e.target.value))}
      >
        <option value={5}>Last 5</option>
        <option value={10}>Last 10</option>
        <option value={20}>Last 20</option>
        <option value={82}>Full Season</option>
      </select>

      {showSearchButton && (
        <button type="button" className="search-button" onClick={handleSubmit}>
          Search
        </button>
      )}
    </div>
  );
}

export default SearchBar;
