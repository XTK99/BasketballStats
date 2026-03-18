import { useState } from "react";
import { getPlayerGames, getTeamGames } from "./api/nbaApi";
import ModeToggle from "./components/ModeToggle";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import GameLogTable from "./components/GameLogTable";
import StatSelector from "./components/StatSelector";
import StatChart from "./components/StatChart";

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
    <div style={{ padding: "20px" }}>
      <h1>NBA Stats Viewer</h1>

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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div>
          <h2>{title}</h2>
          <p>Season: {data.season}</p>
          <p>Games: {data.count}</p>

          <SummaryCards averages={data.averages} />

          <StatSelector
            selectedStat={selectedStat}
            setSelectedStat={setSelectedStat}
          />

          <StatChart games={data.games} selectedStat={selectedStat} />

          <GameLogTable games={data.games} />
        </div>
      )}
    </div>
  );
}

export default App;
