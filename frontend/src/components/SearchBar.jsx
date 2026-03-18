function SearchBar({
  mode,
  searchValue,
  setSearchValue,
  last,
  setLast,
  handleSearch,
  loading,
}) {
  function handleLastWheel(e) {
    e.preventDefault();

    const current = Number(last || 0);
    const nextValue = e.deltaY < 0 ? current + 1 : current - 1;

    setLast(Math.max(1, nextValue));
  }

  return (
    <div className="search-row">
      <input
        className="search-input"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={mode === "player" ? "Search player" : "Search team"}
      />

      <input
        className="last-games-input"
        type="text"
        inputMode="numeric"
        value={String(last)}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/[^\d]/g, "");
          setLast(digitsOnly === "" ? 1 : Number(digitsOnly));
        }}
        onWheel={(e) => {
          e.preventDefault();
          const current = Number(last || 1);
          const nextValue = e.deltaY < 0 ? current + 1 : current - 1;
          setLast(Math.max(1, nextValue));
        }}
        onWheelCapture={(e) => {
          e.preventDefault();
        }}
        placeholder="Last"
      />

      <button
        type="button"
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
