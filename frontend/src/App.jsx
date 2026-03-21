import { useMemo, useRef, useState } from "react";
import "./App.css";

import { getPlayerGames, getTeamGames, getBoxScore } from "./api/nbaApi";
import PropEdgeCard from "./components/PropEdgeCard";
import { calculatePropInsights } from "./utils/calculatePropInsights";
import ModeToggle from "./components/ModeToggle";
import SearchBar from "./components/SearchBar";
import FiltersBar from "./components/FiltersBar";
import ThresholdFilter from "./components/ThresholdFilter";
import ActiveFilters from "./components/ActiveFilters";
import SummaryCards from "./components/SummaryCards";
import SplitsPanel from "./components/SplitsPanel";
import StatSelector from "./components/StatSelector";
import StatChart from "./components/StatChart";
import HitRateBoard from "./components/HitRateBoard";
import GameLogTable from "./components/GameLogTable";
import BoxScorePanel from "./components/BoxScorePanel";
import BettingSimulator from "./components/BettingSimulator";

import { normalizeGames } from "./utils/normalizeGames";
import { filterGames } from "./utils/filterGames";
import { calculateFilteredAverages } from "./utils/calculateFilteredAverages";

const INITIAL_FILTERS = {
  location: "all",
  result: "all",
  opponent: "",
  thresholds: [],
};

const STAT_LABEL_MAP = {
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",
  minutes: "Minutes",
  threesMade: "3PM",
};

function getThresholdStatKey(filter) {
  return (
    filter?.stat || filter?.selectedStat || filter?.key || filter?.field || ""
  );
}

function getThresholdValue(filter) {
  const rawValue =
    filter?.value ??
    filter?.line ??
    filter?.threshold ??
    filter?.target ??
    null;

  const num = Number(rawValue);
  return Number.isFinite(num) ? num : NaN;
}

function App() {
  const [isBoxScoreOpen, setIsBoxScoreOpen] = useState(true);
  const [mode, setMode] = useState("player");
  const [viewMode, setViewMode] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("LeBron James");
  const [season, setSeason] = useState("2025-26");
  const [last, setLast] = useState(10);
  const [selectedStat, setSelectedStat] = useState("points");

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedGameId, setSelectedGameId] = useState(null);
  const [boxScore, setBoxScore] = useState(null);
  const [boxScoreLoading, setBoxScoreLoading] = useState(false);
  const [boxScoreError, setBoxScoreError] = useState("");
  const [boardStat, setBoardStat] = useState("points");

  const boxScoreRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function removeThresholdFilter(indexToRemove) {
    setFilters((prev) => ({
      ...prev,
      thresholds: prev.thresholds.filter((_, index) => index !== indexToRemove),
    }));
  }

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");
      setBoxScore(null);
      setSelectedGameId(null);

      const response =
        mode === "player"
          ? await getPlayerGames(searchValue, last, season)
          : await getTeamGames(searchValue, last, season);

      const normalized = normalizeGames(response?.games || [], mode);

      setGames(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
      setGames([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectGame(game) {
    setIsBoxScoreOpen(true);
    const gameId = game?.gameId;
    if (!gameId) return;

    try {
      setSelectedGameId(gameId);
      setSelectedGame(game);
      setBoxScoreLoading(true);
      setBoxScoreError("");

      const response = await getBoxScore(gameId);
      setBoxScore(response);

      requestAnimationFrame(() => {
        setTimeout(() => {
          boxScoreRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 50);
      });
    } catch (err) {
      console.error(err);
      setBoxScoreError("Failed to load box score.");
      setBoxScore(null);
    } finally {
      setBoxScoreLoading(false);
    }
  }
  const filteredGames = useMemo(
    () => filterGames(games, filters),
    [games, filters],
  );

  const averages = useMemo(
    () => calculateFilteredAverages(filteredGames),
    [filteredGames],
  );

  const title = useMemo(() => {
    if (!searchValue?.trim()) {
      return mode === "player" ? "Player" : "Team";
    }
    return searchValue.trim();
  }, [searchValue, mode]);

  const activeStatThreshold = useMemo(() => {
    return filters.thresholds.find((filter) => {
      const filterStatKey = String(getThresholdStatKey(filter)).toLowerCase();
      return filterStatKey === String(selectedStat).toLowerCase();
    });
  }, [filters.thresholds, selectedStat]);

  const selectedLine = useMemo(() => {
    if (!activeStatThreshold) return NaN;
    return getThresholdValue(activeStatThreshold);
  }, [activeStatThreshold]);

  const propInsights = useMemo(() => {
    if (!Number.isFinite(selectedLine)) return null;

    return calculatePropInsights({
      games: filteredGames,
      statKey: selectedStat,
      line: selectedLine,
    });
  }, [filteredGames, selectedStat, selectedLine]);

  const showDashboard = !loading && !error && viewMode === "dashboard";
  const showSimulator = !loading && !error && viewMode === "simulator";

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Basketball Stats Dashboard</h1>
        <p className="app-subtitle">App is rendering.</p>
      </header>

      <section className="panel-card">
        <ModeToggle mode={mode} setMode={setMode} />
        <SearchBar
          mode={mode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          season={season}
          setSeason={setSeason}
          last={last}
          setLast={setLast}
          onSearch={handleSearch}
        />
      </section>

      <section className="view-toggle-row">
        <button
          className={`tab-button ${viewMode === "dashboard" ? "active" : ""}`}
          onClick={() => setViewMode("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`tab-button ${viewMode === "simulator" ? "active" : ""}`}
          onClick={() => setViewMode("simulator")}
        >
          Betting Simulator
        </button>
      </section>

      {loading && <p className="status-message">Loading...</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {showDashboard && (
        <div className="section-stack">
          <section className="panel-card">
            <FiltersBar
              locationFilter={filters.location}
              setLocationFilter={(value) => updateFilter("location", value)}
              resultFilter={filters.result}
              setResultFilter={(value) => updateFilter("result", value)}
              opponentFilter={filters.opponent}
              setOpponentFilter={(value) => updateFilter("opponent", value)}
            />

            <ThresholdFilter
              thresholdFilters={filters.thresholds}
              setThresholdFilters={(value) => updateFilter("thresholds", value)}
            />

            <ActiveFilters
              locationFilter={filters.location}
              resultFilter={filters.result}
              opponentFilter={filters.opponent}
              thresholdFilters={filters.thresholds}
              onRemoveThresholdFilter={removeThresholdFilter}
            />
          </section>

          <SummaryCards averages={averages} />

          <PropEdgeCard
            title={title}
            statLabel={STAT_LABEL_MAP[selectedStat] || selectedStat}
            insights={propInsights}
          />

          <SplitsPanel games={filteredGames} />

          <section className="panel-card">
            <StatSelector
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />
            <StatChart games={filteredGames} selectedStat={selectedStat} />
          </section>

          <HitRateBoard
            games={filteredGames}
            selectedStat={selectedStat}
            boardStat={boardStat}
            setBoardStat={setBoardStat}
            mode={mode}
          />

          <section ref={boxScoreRef} className="section-stack">
            {(selectedGame || boxScoreLoading || boxScoreError) && (
              <section className="panel-card selected-game-card">
                <div className="selected-game-header">
                  <div>
                    <h3 className="panel-title">Selected Game</h3>
                    <p className="selected-game-subtitle">
                      {selectedGame
                        ? `${selectedGame.gameDate} • ${selectedGame.matchup} • ${selectedGame.result || "—"}`
                        : "Loading selected game..."}
                    </p>
                  </div>

                  <div className="selected-game-actions">
                    <button
                      className="collapse-button"
                      onClick={() => setIsBoxScoreOpen((prev) => !prev)}
                    >
                      {isBoxScoreOpen ? "Hide Box Score" : "Show Box Score"}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {isBoxScoreOpen && (
              <BoxScorePanel
                boxScore={boxScore}
                loading={boxScoreLoading}
                error={boxScoreError}
                selectedPlayerName={mode === "player" ? searchValue : ""}
              />
            )}
          </section>
          <GameLogTable
            games={filteredGames}
            onSelectGame={handleSelectGame}
            selectedGameId={selectedGameId}
          />
        </div>
      )}

      {showSimulator && (
        <div className="section-stack">
          <BettingSimulator games={games} filteredGames={filteredGames} />
        </div>
      )}
    </div>
  );
}

export default App;
