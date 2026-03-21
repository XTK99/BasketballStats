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
}) {
  return (
    <div className="searchbar">
      <input
        className="search-input"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={mode === "player" ? "Search player..." : "Search team..."}
      />

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

      <button className="search-button" onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
