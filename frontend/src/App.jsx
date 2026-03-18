import { useMemo, useState } from "react";
import { getPlayerGames, getTeamGames } from "./api/nbaApi";
import ModeToggle from "./components/ModeToggle";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import GameLogTable from "./components/GameLogTable";
import StatSelector from "./components/StatSelector";
import StatChart from "./components/StatChart";
import FiltersBar from "./components/FiltersBar";
import { filterGames } from "./utils/filterGames";
import { calculateFilteredAverages } from "./utils/calculateFilteredAverages";
import "./App.css";
import ThresholdFilter from "./components/ThresholdFilter";
import ActiveFilters from "./components/ActiveFilters";

function App() {
  const [mode, setMode] = useState("player");
  const [searchValue, setSearchValue] = useState("LeBron James");
  const [last, setLast] = useState(5);
  const [selectedStat, setSelectedStat] = useState("points");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [locationFilter, setLocationFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [opponentFilter, setOpponentFilter] = useState("");

  // current threshold input controls
  const [thresholdStat, setThresholdStat] = useState("points");
  const [thresholdOperator, setThresholdOperator] = useState(">=");
  const [thresholdValue, setThresholdValue] = useState("");

  // applied threshold filters
  const [thresholdFilters, setThresholdFilters] = useState([]);

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const result =
        mode === "player"
          ? await getPlayerGames(searchValue, last)
          : await getTeamGames(searchValue, last);

      setData(result);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleAddThresholdFilter() {
    if (thresholdValue === "") return;

    const newFilter = {
      stat: thresholdStat,
      operator: thresholdOperator,
      value: Number(thresholdValue),
    };

    setThresholdFilters((prev) => {
      const alreadyExists = prev.some(
        (filter) =>
          filter.stat === newFilter.stat &&
          filter.operator === newFilter.operator &&
          filter.value === newFilter.value,
      );

      if (alreadyExists) return prev;

      return [...prev, newFilter];
    });

    setThresholdValue("");
  }

  function handleRemoveThresholdFilter(indexToRemove) {
    setThresholdFilters((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }

  const filteredGames = useMemo(() => {
    if (!data?.games) return [];

    return filterGames(
      data.games,
      locationFilter,
      resultFilter,
      opponentFilter,
      thresholdFilters,
    );
  }, [data, locationFilter, resultFilter, opponentFilter, thresholdFilters]);

  const filteredAverages = useMemo(() => {
    return calculateFilteredAverages(filteredGames);
  }, [filteredGames]);

  const title = mode === "player" ? data?.player : data?.teamName;

  function clearFilters() {
    setLocationFilter("all");
    setResultFilter("all");
    setOpponentFilter("");
    setThresholdStat("points");
    setThresholdOperator(">=");
    setThresholdValue("");
    setThresholdFilters([]);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">NBA Stats Viewer</h1>
        <p className="app-subtitle">
          Search recent player and team performance, compare averages, and track
          trends.
        </p>
      </header>

      <section className="toolbar-card">
        <ModeToggle
          mode={mode}
          setMode={setMode}
          setSearchValue={setSearchValue}
          setData={setData}
          setError={setError}
        />

        <SearchBar
          mode={mode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          last={last}
          setLast={setLast}
          handleSearch={handleSearch}
          loading={loading}
        />

        {error && <p className="status-error">{error}</p>}
      </section>

      {data && (
        <>
          <section className="results-header">
            <h2 className="results-title">{title}</h2>
            <div className="results-meta">
              Season: {data.season} • Loaded Games: {data.count} • Filtered
              Games: {filteredGames.length}
            </div>
          </section>

          <FiltersBar
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            resultFilter={resultFilter}
            setResultFilter={setResultFilter}
            opponentFilter={opponentFilter}
            setOpponentFilter={setOpponentFilter}
            clearFilters={clearFilters}
          />

          <ThresholdFilter
            thresholdStat={thresholdStat}
            setThresholdStat={setThresholdStat}
            thresholdOperator={thresholdOperator}
            setThresholdOperator={setThresholdOperator}
            thresholdValue={thresholdValue}
            setThresholdValue={setThresholdValue}
            onAddFilter={handleAddThresholdFilter}
          />

          <ActiveFilters
            locationFilter={locationFilter}
            resultFilter={resultFilter}
            opponentFilter={opponentFilter}
            thresholdFilters={thresholdFilters}
            onRemoveThresholdFilter={handleRemoveThresholdFilter}
          />

          <SummaryCards averages={filteredAverages} />

          <section className="panel-card">
            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />
            <StatChart games={filteredGames} selectedStat={selectedStat} />
          </section>

          <GameLogTable games={filteredGames} />
        </>
      )}
    </div>
  );
}

export default App;
