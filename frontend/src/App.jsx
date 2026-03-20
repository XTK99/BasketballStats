import { useMemo, useState } from "react";

import "./App.css";

import { getPlayerGames, getTeamGames, getBoxScore } from "./api/nbaApi";

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
import HistoricalKalshiTestCard from "./components/HistoricalKalshiTestCard";
import { normalizeGames } from "./utils/normalizeGames";
import { filterGames } from "./utils/filterGames";
import { calculateFilteredAverages } from "./utils/calculateFilteredAverages";
import { calculateSplits } from "./utils/calculateSplits";
import { generateThresholds } from "./utils/generateThresholds";
import { calculateHitRateBoard } from "./utils/calculateHitRateBoard";
import { mergePlayerGamesWithTeamGames } from "./utils/mergePlayerGamesWithTeamGames";

const DEFAULT_THRESHOLD_STAT = "points";
const DEFAULT_THRESHOLD_OPERATOR = ">=";
const DEFAULT_BOARD_STAT = "points";
const DEFAULT_SELECTED_STAT = "points";
const DEFAULT_GAME_COUNT = 5;
const FULL_SEASON_GAME_COUNT = 100;

function App() {
  const [mode, setMode] = useState("player");
  const [viewMode, setViewMode] = useState("dashboard");

  const [searchValue, setSearchValue] = useState("LeBron James");
  const [last, setLast] = useState(DEFAULT_GAME_COUNT);
  const [selectedStat, setSelectedStat] = useState(DEFAULT_SELECTED_STAT);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [locationFilter, setLocationFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [opponentFilter, setOpponentFilter] = useState("");

  const [thresholdStat, setThresholdStat] = useState(DEFAULT_THRESHOLD_STAT);
  const [thresholdOperator, setThresholdOperator] = useState(
    DEFAULT_THRESHOLD_OPERATOR,
  );
  const [thresholdValue, setThresholdValue] = useState("");
  const [thresholdFilters, setThresholdFilters] = useState([]);

  const [boardStat, setBoardStat] = useState(DEFAULT_BOARD_STAT);

  const [selectedGame, setSelectedGame] = useState(null);
  const [boxScore, setBoxScore] = useState(null);
  const [boxScoreLoading, setBoxScoreLoading] = useState(false);
  const [boxScoreError, setBoxScoreError] = useState("");
  const [isBoxScoreOpen, setIsBoxScoreOpen] = useState(true);

  const [seasonTimelineGames, setSeasonTimelineGames] = useState([]);
  const [teamGamesPlayedCount, setTeamGamesPlayedCount] = useState(0);
  const [teamGamesTotalCount, setTeamGamesTotalCount] = useState(0);
  const [includeMissedGamesInChart, setIncludeMissedGamesInChart] =
    useState(true);

  async function runSearch(gameCount) {
    const safeGameCount = Math.max(1, Number(gameCount) || 1);

    return mode === "player"
      ? getPlayerGames(searchValue, safeGameCount)
      : getTeamGames(searchValue, safeGameCount);
  }

  function resetBoxScoreState() {
    setSelectedGame(null);
    setBoxScore(null);
    setBoxScoreError("");
    setBoxScoreLoading(false);
    setIsBoxScoreOpen(true);
  }

  async function performSearch(gameCount) {
    setLoading(true);
    setError("");
    setData(null);
    setSeasonTimelineGames([]);
    setTeamGamesPlayedCount(0);
    setTeamGamesTotalCount(0);
    resetBoxScoreState();

    try {
      const result = await runSearch(gameCount);

      const normalizedGames = normalizeGames(result?.games || []);

      const normalizedResult = {
        ...result,
        games: normalizedGames,
      };

      setData(normalizedResult);

      if (mode === "player") {
        const playerTeamIdentifier =
          result?.teamId ||
          result?.teamName ||
          result?.team ||
          result?.playerTeam ||
          result?.teamAbbreviation ||
          "";

        if (playerTeamIdentifier) {
          const fullTeamResult = await getTeamGames(
            playerTeamIdentifier,
            FULL_SEASON_GAME_COUNT,
          );

          const normalizedTeamGames = normalizeGames(
            fullTeamResult?.games || [],
          );

          const chronologicalTeamGames = [...normalizedTeamGames].reverse();
          const chronologicalPlayerGames = [...normalizedGames].reverse();

          const mergedTimeline = mergePlayerGamesWithTeamGames(
            chronologicalPlayerGames,
            chronologicalTeamGames,
          );

          setSeasonTimelineGames(mergedTimeline);
          setTeamGamesPlayedCount(
            mergedTimeline.filter((game) => game.played).length,
          );
          setTeamGamesTotalCount(mergedTimeline.length);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    await performSearch(last);
  }

  async function handleUseFullSeason() {
    setLast(FULL_SEASON_GAME_COUNT);
    await performSearch(FULL_SEASON_GAME_COUNT);
  }

  async function handleSelectGame(game) {
    try {
      setSelectedGame(game);
      setBoxScore(null);
      setBoxScoreError("");
      setBoxScoreLoading(true);
      setIsBoxScoreOpen(true);

      const result = await getBoxScore(game.gameId);
      setBoxScore(result);
    } catch (err) {
      console.error("Box score error:", err);
      setBoxScoreError(err.message || "Failed to load box score");
    } finally {
      setBoxScoreLoading(false);
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

      return alreadyExists ? prev : [...prev, newFilter];
    });

    setThresholdValue("");
  }

  function handleRemoveThresholdFilter(indexToRemove) {
    setThresholdFilters((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }

  function handleRemoveLocationFilter() {
    setLocationFilter("all");
  }

  function handleRemoveResultFilter() {
    setResultFilter("all");
  }

  function handleRemoveOpponentFilter() {
    setOpponentFilter("");
  }

  function clearFilters() {
    setLocationFilter("all");
    setResultFilter("all");
    setOpponentFilter("");
    setThresholdStat(DEFAULT_THRESHOLD_STAT);
    setThresholdOperator(DEFAULT_THRESHOLD_OPERATOR);
    setThresholdValue("");
    setThresholdFilters([]);
  }

  const gamesForFiltering = useMemo(() => {
    if (mode === "player" && seasonTimelineGames.length > 0) {
      return seasonTimelineGames;
    }

    return data?.games || [];
  }, [mode, seasonTimelineGames, data]);

  const searchedTimelineGames = useMemo(() => {
    if (mode !== "player") {
      return data?.games || [];
    }

    if (seasonTimelineGames.length === 0) {
      return data?.games || [];
    }

    return seasonTimelineGames.slice(-last);
  }, [mode, seasonTimelineGames, data, last]);

  const filteredGames = useMemo(() => {
    return filterGames(
      gamesForFiltering,
      locationFilter,
      resultFilter,
      opponentFilter,
      thresholdFilters,
    );
  }, [
    gamesForFiltering,
    locationFilter,
    resultFilter,
    opponentFilter,
    thresholdFilters,
  ]);

  const playedFilteredGames = useMemo(() => {
    if (mode !== "player") {
      return filteredGames;
    }

    return filteredGames.filter((game) => game.played !== false);
  }, [mode, filteredGames]);

  const filteredAverages = useMemo(() => {
    return calculateFilteredAverages(playedFilteredGames);
  }, [playedFilteredGames]);

  const splits = useMemo(() => {
    return calculateSplits(playedFilteredGames);
  }, [playedFilteredGames]);

  const boardThresholds = useMemo(() => {
    return generateThresholds(boardStat);
  }, [boardStat]);

  const boardData = useMemo(() => {
    return calculateHitRateBoard(
      playedFilteredGames,
      boardStat,
      boardThresholds,
    );
  }, [playedFilteredGames, boardStat, boardThresholds]);

  const title = mode === "player" ? data?.player : data?.teamName;

  const loadedGames =
    mode === "player" ? searchedTimelineGames.length : data?.count || 0;

  const filteredCount =
    mode === "player"
      ? filteredGames.filter((game) => game.played).length
      : filteredGames.length;

  const filteredPercent =
    loadedGames > 0 ? Math.round((filteredCount / loadedGames) * 100) : 0;

  const chartGames =
    mode === "player"
      ? includeMissedGamesInChart
        ? searchedTimelineGames
        : playedFilteredGames
      : [...filteredGames].reverse();

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
          fullSeasonCount={loadedGames}
          onUseFullSeason={handleUseFullSeason}
        />

        {error && <p className="status-error">{error}</p>}
      </section>

      {data && (
        <>
          <section className="view-toggle-card">
            <div className="view-toggle">
              <button
                type="button"
                className={`view-toggle-button ${
                  viewMode === "dashboard" ? "is-active" : ""
                }`}
                onClick={() => setViewMode("dashboard")}
              >
                Dashboard
              </button>

              <button
                type="button"
                className={`view-toggle-button ${
                  viewMode === "betting" ? "is-active" : ""
                }`}
                onClick={() => setViewMode("betting")}
              >
                Betting Simulator
              </button>
            </div>
          </section>

          {viewMode === "dashboard" ? (
            <>
              <section className="results-header">
                <div className="results-header-main">
                  <div className="results-title-block">
                    <h2 className="results-title">{title}</h2>

                    <div className="results-subrow">
                      <span className="season-badge">Season {data.season}</span>

                      {mode === "player" && teamGamesTotalCount > 0 && (
                        <span className="season-badge">
                          Played {teamGamesPlayedCount} / {teamGamesTotalCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="hero-stats">
                    <div className="hero-stat-card">
                      <span className="hero-stat-label">
                        Games Matching Filters
                      </span>
                      <span className="hero-stat-value">
                        {filteredCount} / {loadedGames}
                      </span>
                      <span className="hero-stat-subvalue">
                        {filteredPercent}% match
                      </span>
                    </div>
                  </div>
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
                onRemoveLocationFilter={handleRemoveLocationFilter}
                onRemoveResultFilter={handleRemoveResultFilter}
                onRemoveOpponentFilter={handleRemoveOpponentFilter}
                onRemoveThresholdFilter={handleRemoveThresholdFilter}
              />

              <SummaryCards averages={filteredAverages} />
              <SplitsPanel splits={splits} />

              <section className="panel-card">
                <StatSelector
                  selectedStat={selectedStat}
                  setSelectedStat={setSelectedStat}
                />
                <StatChart
                  games={chartGames}
                  selectedStat={selectedStat}
                  includeMissedGamesInChart={includeMissedGamesInChart}
                  setIncludeMissedGamesInChart={setIncludeMissedGamesInChart}
                  mode={mode}
                />
              </section>

              {mode === "player" && (
                <HitRateBoard
                  title={title}
                  season={data.season}
                  stat={boardStat}
                  setStat={setBoardStat}
                  boardData={boardData}
                  gameCount={playedFilteredGames.length}
                />
              )}

              {selectedGame && (
                <section className="panel-card">
                  <div className="boxscore-section-header">
                    <h3 className="panel-title">
                      Box Score: {selectedGame.matchup} ({selectedGame.gameDate}
                      )
                    </h3>

                    <button
                      type="button"
                      className="secondary-button boxscore-toggle-button"
                      onClick={() => setIsBoxScoreOpen((prev) => !prev)}
                    >
                      {isBoxScoreOpen ? "Minimize" : "Expand"}
                    </button>
                  </div>

                  {isBoxScoreOpen && (
                    <>
                      {boxScoreLoading && <p>Loading box score...</p>}
                      {boxScoreError && (
                        <p className="status-error">{boxScoreError}</p>
                      )}
                      {boxScore && (
                        <BoxScorePanel
                          boxScore={boxScore}
                          selectedPlayerName={mode === "player" ? title : ""}
                        />
                      )}
                    </>
                  )}
                </section>
              )}

              <GameLogTable
                games={mode === "player" ? playedFilteredGames : filteredGames}
                onSelectGame={handleSelectGame}
              />
            </>
          ) : (
            <div className="betting-view-stack">
              <HistoricalKalshiTestCard />
              <BettingSimulator
                games={
                  mode === "player" ? searchedTimelineGames : filteredGames
                }
                selectedStat={selectedStat}
                title={title}
                mode={mode}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
