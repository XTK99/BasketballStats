import { useEffect, useRef, useState } from "react";
import { searchPlayers } from "../api/nbaApi";
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function fetchSuggestions() {
      const query = searchValue.trim();

      if (mode !== "player" || query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
        return;
      }

      try {
        const data = await searchPlayers(query);

        if (!ignore) {
          const nextSuggestions = data.players || [];
          setSuggestions(nextSuggestions);
          setShowSuggestions(nextSuggestions.length > 0);
          setActiveIndex(-1);
        }
      } catch (err) {
        if (!ignore) {
          setSuggestions([]);
          setShowSuggestions(false);
          setActiveIndex(-1);
        }
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 250);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [searchValue, mode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelectPlayer(playerName) {
    setSearchValue(playerName);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (mode !== "player") {
      if (e.key === "Enter") onSearch();
      return;
    }

    if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setShowSuggestions(true);
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setShowSuggestions(true);
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      return;
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (showSuggestions && activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectPlayer(suggestions[activeIndex].name);
      } else {
        setShowSuggestions(false);
        setActiveIndex(-1);
        onSearch();
      }
    }
  }

  return (
    <div className="searchbar" ref={wrapperRef}>
      <div className="search-input-wrap">
        <input
          className="search-input"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (mode === "player" && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={
            mode === "player" ? "Search player..." : "Search team..."
          }
        />

        {mode === "player" && showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((player, index) => (
              <button
                key={player.id}
                type="button"
                className={`search-suggestion-item ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleSelectPlayer(player.name)}
              >
                {player.name}
              </button>
            ))}
          </div>
        )}
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

      <button className="search-button" onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
