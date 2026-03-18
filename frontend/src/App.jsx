import { useState } from "react";
import { getPlayerGames, getTeamGames } from "./api/nbaApi";
import ModeToggle from "./components/ModeToggle";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import GameLogTable from "./components/GameLogTable";
import StatSelector from "./components/StatSelector";
import StatChart from "./components/StatChart";
import "./App.css";

function App() {
  const [mode, setMode] = useState("player");
  const [searchValue, setSearchValue] = useState("LeBron James");
  const [last, setLast] = useState(5);
  const [selectedStat, setSelectedStat] = useState("points");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const title = mode === "player" ? data?.player : data?.teamName;

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
              Season: {data.season} • Games: {data.count}
            </div>
          </section>

          <SummaryCards averages={data.averages} />

          <section className="panel-card">
            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />
            <StatChart games={data.games} selectedStat={selectedStat} />
          </section>

          <GameLogTable games={data.games} />
        </>
      )}
    </div>
  );
}

export default App;
