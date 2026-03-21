import { useEffect, useRef, useState } from "react";
import { searchPlayers, searchTeams } from "../api/nbaApi";
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function fetchSuggestions() {
      const query = searchValue.trim();

      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
        return;
      }

      try {
        let nextSuggestions = [];

        if (mode === "player") {
          const data = await searchPlayers(query, season);
          nextSuggestions = (data.players || []).map((player) => ({
            id: player.id,
            value: player.name,
            label: player.name,
            meta: player.team || "",
          }));
        } else {
          const data = await searchTeams(query);
          nextSuggestions = (data.teams || []).map((team) => ({
            id: team.id,
            value: team.name,
            label: team.name,
            meta: team.abbreviation || "",
          }));
        }

        if (!ignore) {
          const normalizedQuery = query.trim().toLowerCase();

          const exactMatches = nextSuggestions.filter(
            (item) => item.label.trim().toLowerCase() === normalizedQuery,
          );

          const shouldShowSuggestions =
            nextSuggestions.length > 0 && exactMatches.length === 0;

          setSuggestions(nextSuggestions);
          setShowSuggestions(shouldShowSuggestions);
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
  }, [searchValue, mode, season]);

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

  function handleSelectSuggestion(value) {
    setSearchValue(value);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
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
        handleSelectSuggestion(suggestions[activeIndex].value);
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
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={
            mode === "player" ? "Search player..." : "Search team..."
          }
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`search-suggestion-item ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleSelectSuggestion(item.value)}
              >
                <span className="search-suggestion-label">{item.label}</span>
                {item.meta ? (
                  <span className="search-suggestion-meta">{item.meta}</span>
                ) : null}
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

      {showSearchButton && (
        <button className="search-button" onClick={onSearch}>
          Search
        </button>
      )}
    </div>
  );
}

export default SearchBar;
