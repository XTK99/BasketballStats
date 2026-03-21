import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import { getPlayerGames, getTeamGames, getBoxScore } from "./api/nbaApi";
import PropEdgeCard from "./components/PropEdgeCard";
import { calculatePropInsights } from "./utils/calculatePropInsights";
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
import MatchupSnapshot from "./components/MatchupSnapshot";
import { calculateMatchupSnapshot } from "./utils/calculateMatchupSnapshot";
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

const DASHBOARD_VIEWS = ["player", "team"];

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

function deriveTeamQuery(playerResponse, normalizedPlayerGames) {
  const directTeam =
    playerResponse?.teamName ||
    playerResponse?.team ||
    playerResponse?.teamAbbreviation ||
    playerResponse?.team_abbreviation ||
    "";

  if (directTeam) return String(directTeam).trim();

  const firstGame = normalizedPlayerGames?.[0];

  if (firstGame?.teamName) return String(firstGame.teamName).trim();
  if (firstGame?.team) return String(firstGame.team).trim();
  if (firstGame?.teamAbbreviation) {
    return String(firstGame.teamAbbreviation).trim();
  }

  if (firstGame?.matchup) {
    const firstToken = String(firstGame.matchup).trim().split(" ")[0];
    if (firstToken) return firstToken;
  }

  return "";
}

function DashboardSection({
  heading,
  title,
  loading,
  error,
  filters,
  onUpdateFilter,
  onRemoveThresholdFilter,
  averages,
  matchupOpponent,
  selectedStat,
  setSelectedStat,
  boardStat,
  setBoardStat,
  filteredGames,
  selectedLine,
  propInsights,
  matchupSnapshot,
  showGameLog = false,
  onSelectGame,
  selectedGameId,
  headerContent = null,
}) {
  return (
    <div className="section-stack">
      <section className="panel-card">
        <div className="dashboard-header-row">
          <div>
            <h2 className="panel-title">{heading}</h2>
            <p className="app-subtitle">{title}</p>
          </div>
          {headerContent}
        </div>
      </section>

      {loading && (
        <p className="status-message">Loading {heading.toLowerCase()}...</p>
      )}
      {error && <p className="status-message error-message">{error}</p>}

      {!loading && !error && (
        <>
          <section className="panel-card">
            <FiltersBar
              locationFilter={filters.location}
              setLocationFilter={(value) => onUpdateFilter("location", value)}
              resultFilter={filters.result}
              setResultFilter={(value) => onUpdateFilter("result", value)}
              opponentFilter={filters.opponent}
              setOpponentFilter={(value) => onUpdateFilter("opponent", value)}
            />

            <ThresholdFilter
              thresholdFilters={filters.thresholds}
              setThresholdFilters={(value) =>
                onUpdateFilter("thresholds", value)
              }
            />

            <ActiveFilters
              locationFilter={filters.location}
              resultFilter={filters.result}
              opponentFilter={filters.opponent}
              thresholdFilters={filters.thresholds}
              onRemoveThresholdFilter={onRemoveThresholdFilter}
            />
          </section>

          <SummaryCards averages={averages} />

          <MatchupSnapshot
            title="Matchup Snapshot"
            opponent={matchupOpponent}
            statLabel={STAT_LABEL_MAP[selectedStat] || selectedStat}
            snapshot={matchupSnapshot}
          />

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
            mode="dashboard"
          />

          {showGameLog && (
            <GameLogTable
              games={filteredGames}
              onSelectGame={onSelectGame}
              selectedGameId={selectedGameId}
            />
          )}
        </>
      )}
    </div>
  );
}

function App() {
  const [viewMode, setViewMode] = useState("dashboard");
  const [activeDashboardView, setActiveDashboardView] = useState("player");

  const [playerQuery, setPlayerQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");

  const [season, setSeason] = useState("2025-26");
  const [last, setLast] = useState(82);

  const [playerSelectedStat, setPlayerSelectedStat] = useState("points");
  const [teamSelectedStat, setTeamSelectedStat] = useState("points");

  const [playerBoardStat, setPlayerBoardStat] = useState("points");
  const [teamBoardStat, setTeamBoardStat] = useState("points");

  const [playerFilters, setPlayerFilters] = useState(INITIAL_FILTERS);
  const [teamFilters, setTeamFilters] = useState(INITIAL_FILTERS);

  const [playerGames, setPlayerGames] = useState([]);
  const [teamGames, setTeamGames] = useState([]);

  const [playerTitle, setPlayerTitle] = useState("Player");
  const [teamTitle, setTeamTitle] = useState("Team");

  const [playerLoading, setPlayerLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);

  const [playerError, setPlayerError] = useState("");
  const [teamError, setTeamError] = useState("");

  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [boxScore, setBoxScore] = useState(null);
  const [boxScoreLoading, setBoxScoreLoading] = useState(false);
  const [boxScoreError, setBoxScoreError] = useState("");
  const [isBoxScoreOpen, setIsBoxScoreOpen] = useState(true);

  const boxScoreRef = useRef(null);
  const skipNextTeamAutoSearchRef = useRef(false);
  useEffect(() => {
    const trimmedQuery = playerQuery.trim();

    if (!trimmedQuery) {
      setPlayerGames([]);
      setTeamGames([]);
      setPlayerTitle("Player");
      setTeamTitle("Team");
      setPlayerError("");
      setTeamError("");
      return;
    }

    const timeoutId = setTimeout(() => {
      handlePlayerSearch();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [playerQuery, season, last]);

  useEffect(() => {
    if (activeDashboardView !== "team") return;

    if (skipNextTeamAutoSearchRef.current) {
      skipNextTeamAutoSearchRef.current = false;
      return;
    }

    const trimmedQuery = teamQuery.trim();

    if (!trimmedQuery) {
      setTeamGames([]);
      setTeamTitle("Team");
      setTeamError("");
      return;
    }

    const timeoutId = setTimeout(() => {
      handleTeamSearch();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [teamQuery, season, last, activeDashboardView]);

  function updatePlayerFilter(key, value) {
    setPlayerFilters((prev) => ({ ...prev, [key]: value }));
  }

  function updateTeamFilter(key, value) {
    setTeamFilters((prev) => ({ ...prev, [key]: value }));
  }

  function removePlayerThresholdFilter(indexToRemove) {
    setPlayerFilters((prev) => ({
      ...prev,
      thresholds: prev.thresholds.filter((_, index) => index !== indexToRemove),
    }));
  }

  function removeTeamThresholdFilter(indexToRemove) {
    setTeamFilters((prev) => ({
      ...prev,
      thresholds: prev.thresholds.filter((_, index) => index !== indexToRemove),
    }));
  }

  function goToPreviousDashboard() {
    const currentIndex = DASHBOARD_VIEWS.indexOf(activeDashboardView);
    const nextIndex =
      currentIndex === 0 ? DASHBOARD_VIEWS.length - 1 : currentIndex - 1;
    setActiveDashboardView(DASHBOARD_VIEWS[nextIndex]);
  }

  function goToNextDashboard() {
    const currentIndex = DASHBOARD_VIEWS.indexOf(activeDashboardView);
    const nextIndex =
      currentIndex === DASHBOARD_VIEWS.length - 1 ? 0 : currentIndex + 1;
    setActiveDashboardView(DASHBOARD_VIEWS[nextIndex]);
  }

  async function handlePlayerSearch() {
    const trimmedQuery = playerQuery.trim();

    if (!trimmedQuery) {
      setPlayerGames([]);
      setTeamGames([]);
      setPlayerTitle("Player");
      setTeamTitle("Team");
      setPlayerError("");
      setTeamError("");
      return;
    }

    try {
      setPlayerLoading(true);
      setTeamLoading(true);
      setPlayerError("");
      setTeamError("");
      setSelectedGameId(null);
      setSelectedGame(null);
      setBoxScore(null);
      setBoxScoreError("");

      const playerResponse = await getPlayerGames(trimmedQuery, last, season);
      const normalizedPlayerGames = normalizeGames(
        playerResponse?.games || [],
        "player",
      );

      setPlayerGames(normalizedPlayerGames);
      setPlayerTitle(playerResponse?.playerName || trimmedQuery);

      const derivedTeamQuery = deriveTeamQuery(
        playerResponse,
        normalizedPlayerGames,
      );

      if (!derivedTeamQuery) {
        setTeamGames([]);
        setTeamTitle("Team");
        setTeamQuery("");
        return;
      }

      skipNextTeamAutoSearchRef.current = true;
      setTeamQuery(derivedTeamQuery);
      setTeamTitle(derivedTeamQuery);

      const teamResponse = await getTeamGames(derivedTeamQuery, last, season);
      const normalizedTeamGames = normalizeGames(
        teamResponse?.games || [],
        "team",
      );

      setTeamGames(normalizedTeamGames);
      setTeamTitle(teamResponse?.teamName || derivedTeamQuery);
    } catch (err) {
      console.error(err);
      setPlayerError("Failed to load player dashboard.");
      setTeamError("Failed to load team dashboard.");
      setPlayerGames([]);
      setTeamGames([]);
    } finally {
      setPlayerLoading(false);
      setTeamLoading(false);
    }
  }

  async function handleTeamSearch() {
    const trimmedQuery = teamQuery.trim();

    if (!trimmedQuery) {
      setTeamGames([]);
      setTeamTitle("Team");
      setTeamError("");
      return;
    }

    try {
      setTeamLoading(true);
      setTeamError("");

      const teamResponse = await getTeamGames(trimmedQuery, last, season);
      const normalizedTeamGames = normalizeGames(
        teamResponse?.games || [],
        "team",
      );

      setTeamGames(normalizedTeamGames);
      setTeamTitle(teamResponse?.teamName || trimmedQuery);
    } catch (err) {
      console.error(err);
      setTeamError("Failed to load team dashboard.");
      setTeamGames([]);
    } finally {
      setTeamLoading(false);
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

  const filteredPlayerGames = useMemo(
    () => filterGames(playerGames, playerFilters),
    [playerGames, playerFilters],
  );

  const filteredTeamGames = useMemo(
    () => filterGames(teamGames, teamFilters),
    [teamGames, teamFilters],
  );

  const playerAverages = useMemo(
    () => calculateFilteredAverages(filteredPlayerGames),
    [filteredPlayerGames],
  );

  const teamAverages = useMemo(
    () => calculateFilteredAverages(filteredTeamGames),
    [filteredTeamGames],
  );

  const activePlayerStatThreshold = useMemo(() => {
    return playerFilters.thresholds.find((filter) => {
      const filterStatKey = String(getThresholdStatKey(filter)).toLowerCase();
      return filterStatKey === String(playerSelectedStat).toLowerCase();
    });
  }, [playerFilters.thresholds, playerSelectedStat]);

  const activeTeamStatThreshold = useMemo(() => {
    return teamFilters.thresholds.find((filter) => {
      const filterStatKey = String(getThresholdStatKey(filter)).toLowerCase();
      return filterStatKey === String(teamSelectedStat).toLowerCase();
    });
  }, [teamFilters.thresholds, teamSelectedStat]);

  const playerSelectedLine = useMemo(() => {
    if (!activePlayerStatThreshold) return NaN;
    return getThresholdValue(activePlayerStatThreshold);
  }, [activePlayerStatThreshold]);

  const teamSelectedLine = useMemo(() => {
    if (!activeTeamStatThreshold) return NaN;
    return getThresholdValue(activeTeamStatThreshold);
  }, [activeTeamStatThreshold]);

  const playerPropInsights = useMemo(() => {
    if (!Number.isFinite(playerSelectedLine)) return null;

    return calculatePropInsights({
      games: filteredPlayerGames,
      statKey: playerSelectedStat,
      line: playerSelectedLine,
    });
  }, [filteredPlayerGames, playerSelectedStat, playerSelectedLine]);

  const teamPropInsights = useMemo(() => {
    if (!Number.isFinite(teamSelectedLine)) return null;

    return calculatePropInsights({
      games: filteredTeamGames,
      statKey: teamSelectedStat,
      line: teamSelectedLine,
    });
  }, [filteredTeamGames, teamSelectedStat, teamSelectedLine]);

  const playerMatchupOpponent =
    playerFilters.opponent || selectedGame?.opponent || "";

  const teamMatchupOpponent = teamFilters.opponent || "";

  const playerMatchupSnapshot = useMemo(() => {
    return calculateMatchupSnapshot({
      games: playerGames,
      statKey: playerSelectedStat,
      line: playerSelectedLine,
      opponentFilter: playerMatchupOpponent,
    });
  }, [
    playerGames,
    playerSelectedStat,
    playerSelectedLine,
    playerMatchupOpponent,
  ]);

  const teamMatchupSnapshot = useMemo(() => {
    return calculateMatchupSnapshot({
      games: teamGames,
      statKey: teamSelectedStat,
      line: teamSelectedLine,
      opponentFilter: teamMatchupOpponent,
    });
  }, [teamGames, teamSelectedStat, teamSelectedLine, teamMatchupOpponent]);

  const showDashboard = viewMode === "dashboard";
  const showSimulator = viewMode === "simulator";

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Basketball Stats Dashboard</h1>
        <p className="app-subtitle">App is rendering.</p>
      </header>

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

      {showDashboard && (
        <>
          <div className="dashboard-view-indicators">
            {DASHBOARD_VIEWS.map((view) => (
              <button
                key={view}
                type="button"
                className={`dashboard-view-dot ${
                  activeDashboardView === view ? "active" : ""
                }`}
                onClick={() => setActiveDashboardView(view)}
              >
                {view === "player" ? "Player" : "Team"}
              </button>
            ))}
          </div>

          <section className="dashboard-carousel-shell">
            <button
              type="button"
              className="dashboard-swap-zone dashboard-swap-zone-left"
              onClick={goToPreviousDashboard}
              aria-label="Show previous dashboard"
              title="Previous dashboard"
            >
              <span className="dashboard-swap-arrow">‹</span>
            </button>

            <div className="dashboard-carousel-content">
              {activeDashboardView === "player" && (
                <>
                  <DashboardSection
                    heading="Player Dashboard"
                    title={playerTitle}
                    loading={playerLoading}
                    error={playerError}
                    filters={playerFilters}
                    onUpdateFilter={updatePlayerFilter}
                    onRemoveThresholdFilter={removePlayerThresholdFilter}
                    averages={playerAverages}
                    matchupOpponent={playerMatchupOpponent}
                    selectedStat={playerSelectedStat}
                    setSelectedStat={setPlayerSelectedStat}
                    boardStat={playerBoardStat}
                    setBoardStat={setPlayerBoardStat}
                    filteredGames={filteredPlayerGames}
                    selectedLine={playerSelectedLine}
                    propInsights={playerPropInsights}
                    matchupSnapshot={playerMatchupSnapshot}
                    showGameLog
                    onSelectGame={handleSelectGame}
                    selectedGameId={selectedGameId}
                    headerContent={
                      <div className="dashboard-inline-search">
                        <SearchBar
                          mode="player"
                          searchValue={playerQuery}
                          setSearchValue={setPlayerQuery}
                          season={season}
                          setSeason={setSeason}
                          last={last}
                          setLast={setLast}
                          onSearch={handlePlayerSearch}
                          showSearchButton={false}
                        />
                      </div>
                    }
                  />

                  <section ref={boxScoreRef} className="section-stack">
                    {(selectedGame || boxScoreLoading || boxScoreError) && (
                      <section className="panel-card selected-game-card">
                        <div className="selected-game-header">
                          <div>
                            <h3 className="panel-title">Selected Game</h3>
                            <p className="selected-game-subtitle">
                              {selectedGame
                                ? `${selectedGame.gameDate} • ${selectedGame.matchup} • ${
                                    selectedGame.result || "—"
                                  }`
                                : "Loading selected game..."}
                            </p>
                          </div>

                          <div className="selected-game-actions">
                            <button
                              className="collapse-button"
                              onClick={() => setIsBoxScoreOpen((prev) => !prev)}
                            >
                              {isBoxScoreOpen
                                ? "Hide Box Score"
                                : "Show Box Score"}
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
                        selectedPlayerName={playerQuery}
                      />
                    )}
                  </section>
                </>
              )}

              {activeDashboardView === "team" && (
                <DashboardSection
                  heading="Team Dashboard"
                  title={teamTitle}
                  loading={teamLoading}
                  error={teamError}
                  filters={teamFilters}
                  onUpdateFilter={updateTeamFilter}
                  onRemoveThresholdFilter={removeTeamThresholdFilter}
                  averages={teamAverages}
                  matchupOpponent={teamMatchupOpponent}
                  selectedStat={teamSelectedStat}
                  setSelectedStat={setTeamSelectedStat}
                  boardStat={teamBoardStat}
                  setBoardStat={setTeamBoardStat}
                  filteredGames={filteredTeamGames}
                  selectedLine={teamSelectedLine}
                  propInsights={teamPropInsights}
                  matchupSnapshot={teamMatchupSnapshot}
                  headerContent={
                    <div className="dashboard-inline-search">
                      <SearchBar
                        mode="team"
                        searchValue={teamQuery}
                        setSearchValue={setTeamQuery}
                        season={season}
                        setSeason={setSeason}
                        last={last}
                        setLast={setLast}
                        onSearch={handleTeamSearch}
                        showSearchButton={false}
                      />
                    </div>
                  }
                />
              )}
            </div>

            <button
              type="button"
              className="dashboard-swap-zone dashboard-swap-zone-right"
              onClick={goToNextDashboard}
              aria-label="Show next dashboard"
              title="Next dashboard"
            >
              <span className="dashboard-swap-arrow">›</span>
            </button>
          </section>
        </>
      )}

      {showSimulator && (
        <div className="section-stack">
          <BettingSimulator
            games={playerGames}
            filteredGames={filteredPlayerGames}
          />
        </div>
      )}
    </div>
  );
}

export default App;
