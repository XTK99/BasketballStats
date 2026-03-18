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
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={
          mode === "player" ? "Enter player name" : "Enter team name"
        }
      />

      <input
        type="number"
        value={last}
        onChange={(e) => setLast(Number(e.target.value))}
        min="1"
        max="20"
        style={{ marginLeft: "8px", width: "60px" }}
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        style={{ marginLeft: "8px" }}
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;
