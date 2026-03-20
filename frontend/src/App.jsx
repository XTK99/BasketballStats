import { useEffect, useMemo, useState } from "react";

import "./App.css";

import { getPlayerGames, getTeamGames, getBoxScore } from "./api/nbaApi";
import { getKalshiDirectTeamBets } from "./api/kalshiApi";

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
import KalshiDashboard from "./components/KalshiDashboard";

import { normalizeGames } from "./utils/normalizeGames";
import { filterGames } from "./utils/filterGames";
import { calculateFilteredAverages } from "./utils/calculateFilteredAverages";
import { calculateSplits } from "./utils/calculateSplits";
import { generateThresholds } from "./utils/generateThresholds";
import { calculateHitRateBoard } from "./utils/calculateHitRateBoard";
import { mergePlayerGamesWithTeamGames } from "./utils/mergePlayerGamesWithTeamGames";
import { groupKalshiMarketsByEvent } from "./utils/groupKalshiMarketsByEvent";

const DEFAULT_THRESHOLD_STAT = "points";
const DEFAULT_THRESHOLD_OPERATOR = ">=";
const DEFAULT_BOARD_STAT = "points";
const DEFAULT_SELECTED_STAT = "points";
const DEFAULT_GAME_COUNT = 5;
const FULL_SEASON_GAME_COUNT = 100;

const SEASON_OPTIONS = ["2025-26", "2024-25", "2023-24", "2022-23", "2021-22"];

function getKalshiTeamQuery({ mode, data, searchValue }) {
  if (mode === "team") {
    return (
      data?.teamName ||
      data?.team ||
      data?.teamAbbreviation ||
      searchValue ||
      ""
    );
  }

  return (
    data?.teamName ||
    data?.team ||
    data?.playerTeam ||
    data?.teamAbbreviation ||
    ""
  );
}

function App() {
  const [season, setSeason] = useState("2025-26");
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

  const [kalshiGroupedMarkets, setKalshiGroupedMarkets] = useState([]);
  const [kalshiLoading, setKalshiLoading] = useState(false);
  const [kalshiError, setKalshiError] = useState("");

  async function runSearch(gameCount) {
    const safeGameCount = Math.max(1, Number(gameCount) || 1);

    return mode === "player"
      ? getPlayerGames(searchValue, safeGameCount, season)
      : getTeamGames(searchValue, safeGameCount, season);
  }

  function resetBoxScoreState() {
    setSelectedGame(null);
    setBoxScore(null);
    setBoxScoreError("");
    setBoxScoreLoading(false);
    setIsBoxScoreOpen(true);
  }

  async function performSearch(gameCount) {
    console.log("PERFORM SEARCH START", {
      gameCount,
      mode,
      searchValue,
      season,
    });

    setLoading(true);
    setError("");
    setData(null);
    setSeasonTimelineGames([]);
    setTeamGamesPlayedCount(0);
    setTeamGamesTotalCount(0);
    setKalshiGroupedMarkets([]);
    setKalshiError("");
    resetBoxScoreState();

    try {
      const result = await runSearch(gameCount);
      console.log("SEARCH RESULT", result);

      const normalizedGames = normalizeGames(result?.games || []);
      console.log("NORMALIZED GAMES", normalizedGames);

      const normalizedResult = {
        ...result,
        games: normalizedGames,
      };

      setData(normalizedResult);
      console.log("DATA SET", normalizedResult);

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
            season,
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
            mergedTimeline.filter((game) => game.played !== false).length,
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
    console.log("SEARCH CLICKED", { searchValue, last, season, mode });
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
  const safeTitle =
    title || (mode === "player" ? "Search for a player" : "Search for a team");

  const loadedGames =
    mode === "player" ? searchedTimelineGames.length : data?.count || 0;

  const filteredCount =
    mode === "player"
      ? filteredGames.filter((game) => game.played !== false).length
      : filteredGames.length;

  const filteredPercent =
    loadedGames > 0 ? Math.round((filteredCount / loadedGames) * 100) : 0;

  const chartGames =
    mode === "player"
      ? includeMissedGamesInChart
        ? searchedTimelineGames
        : playedFilteredGames
      : [...filteredGames].reverse();

  useEffect(() => {
    async function loadKalshiMarkets() {
      if (!data) {
        setKalshiGroupedMarkets([]);
        setKalshiError("");
        setKalshiLoading(false);
        return;
      }

      const teamQuery = getKalshiTeamQuery({ mode, data, searchValue });

      if (!teamQuery) {
        setKalshiGroupedMarkets([]);
        setKalshiError("");
        setKalshiLoading(false);
        return;
      }

      try {
        setKalshiLoading(true);
        setKalshiError("");

        const result = await getKalshiDirectTeamBets({
          team: teamQuery,
          status: "open",
          limit: 500,
          maxPages: 5,
        });

        const grouped = groupKalshiMarketsByEvent(result?.matches || []);
        setKalshiGroupedMarkets(grouped);
      } catch (err) {
        console.error("Kalshi direct team bets error:", err);
        setKalshiGroupedMarkets([]);
        setKalshiError(err.message || "Failed to load Kalshi markets");
      } finally {
        setKalshiLoading(false);
      }
    }

    loadKalshiMarkets();
  }, [data, mode, searchValue]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-top">
          <ModeToggle mode={mode} setMode={setMode} />
        </div>

        <SearchBar
          mode={mode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          last={last}
          setLast={setLast}
          onSearch={handleSearch}
          onUseFullSeason={handleUseFullSeason}
          loading={loading}
        />

        <div className="top-toolbar">
          <div className="season-picker">
            <label htmlFor="season-select" className="season-picker-label">
              Season
            </label>

            <div className="season-select-wrap">
              <select
                id="season-select"
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="season-select"
              >
                {SEASON_OPTIONS.map((seasonOption) => (
                  <option key={seasonOption} value={seasonOption}>
                    {seasonOption}
                  </option>
                ))}
              </select>

              <span className="season-select-chevron">▾</span>
            </div>
          </div>

          <div className="view-mode-group">
            <button
              type="button"
              className={viewMode === "dashboard" ? "active-view-button" : ""}
              onClick={() => setViewMode("dashboard")}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={viewMode === "betting" ? "active-view-button" : ""}
              onClick={() => setViewMode("betting")}
            >
              Betting
            </button>
            <button
              type="button"
              className={viewMode === "kalshi" ? "active-view-button" : ""}
              onClick={() => setViewMode("kalshi")}
            >
              Kalshi
            </button>
          </div>
        </div>

        {error && <p className="status-error">{error}</p>}
      </header>

      {viewMode === "dashboard" ? (
        <>
          <section className="results-header">
            <div className="results-header-main">
              <div className="results-title-block">
                <h2 className="results-title">{safeTitle}</h2>

                <div className="results-subrow">
                  <span className="season-badge">{season}</span>

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
              title={safeTitle}
              season={season}
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
                  Box Score: {selectedGame.matchup} ({selectedGame.gameDate})
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
                      selectedPlayerName={mode === "player" ? safeTitle : ""}
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
      ) : viewMode === "betting" ? (
        <div className="betting-view-stack">
          <HistoricalKalshiTestCard />

          {kalshiLoading && <p>Loading Kalshi markets...</p>}
          {kalshiError && <p className="status-error">{kalshiError}</p>}

          <BettingSimulator
            games={mode === "player" ? searchedTimelineGames : filteredGames}
            selectedStat={selectedStat}
            title={safeTitle}
            mode={mode}
            kalshiGroupedMarkets={kalshiGroupedMarkets}
          />
        </div>
      ) : (
        <KalshiDashboard
          groupedMarkets={kalshiGroupedMarkets}
          loading={kalshiLoading}
          error={kalshiError}
          defaultTeamQuery={getKalshiTeamQuery({
            mode,
            data,
            searchValue,
          })}
        />
      )}
    </div>
  );
}

export default App;
