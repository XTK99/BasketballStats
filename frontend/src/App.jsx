import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import { getPlayerGames, getTeamGames, getBoxScore } from "./api/nbaApi";
import BettingSimulator from "./components/BettingSimulator";
import DashboardCarousel from "./components/dashboard/DashboardCarousel";
import PlayerDashboardView from "./components/dashboard/PlayerDashboardView";
import TeamDashboardView from "./components/dashboard/TeamDashboardView";
import { calculatePropInsights } from "./utils/calculatePropInsights";
import { calculateMatchupSnapshot } from "./utils/calculateMatchupSnapshot";
import { normalizeGames } from "./utils/normalizeGames";
import { filterGames } from "./utils/filterGames";
import { calculateFilteredAverages } from "./utils/calculateFilteredAverages";

const INITIAL_FILTERS = {
  locations: ["home", "away"],
  results: ["win", "loss"],
  opponent: "",
  thresholds: [],
};
function toggleFilterValue(values, target) {
  if (values.includes(target)) {
    if (values.length === 1) return values;
    return values.filter((value) => value !== target);
  }

  return [...values, target];
}
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

function App() {
  const [viewMode, setViewMode] = useState("dashboard");
  const [activeDashboardView, setActiveDashboardView] = useState("player");

  const [playerQuery, setPlayerQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");

  const [season, setSeason] = useState("2025-26");
  const [last, setLast] = useState(82);

  const [playerSelectedStat, setPlayerSelectedStat] = useState("points");
  const [teamSelectedStat, setTeamSelectedStat] = useState("points");

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
  function togglePlayerLocation(location) {
    setPlayerFilters((prev) => ({
      ...prev,
      locations: toggleFilterValue(prev.locations, location),
    }));
  }

  function togglePlayerResult(result) {
    setPlayerFilters((prev) => ({
      ...prev,
      results: toggleFilterValue(prev.results, result),
    }));
  }

  function toggleTeamLocation(location) {
    setTeamFilters((prev) => ({
      ...prev,
      locations: toggleFilterValue(prev.locations, location),
    }));
  }

  function toggleTeamResult(result) {
    setTeamFilters((prev) => ({
      ...prev,
      results: toggleFilterValue(prev.results, result),
    }));
  }

  async function handlePlayerSearch() {
    await loadPlayerDashboard(playerQuery);
  }

  async function handleSelectGame(gameOrGameId) {
    setIsBoxScoreOpen(true);

    const game =
      typeof gameOrGameId === "string"
        ? [...playerGames, ...teamGames].find(
            (entry) => entry.gameId === gameOrGameId,
          )
        : gameOrGameId;

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

  async function handleSelectTeamFromBoxScore(teamName) {
    if (!teamName) return;

    setActiveDashboardView("team");
    skipNextTeamAutoSearchRef.current = true;
    setTeamQuery(teamName);
    await handleTeamSearchFromValue(teamName);
  }

  async function handleTeamSearchFromValue(teamName) {
    const trimmedQuery = String(teamName || "").trim();

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
  async function handleSelectPlayerFromBoxScore(playerName) {
    if (!playerName) return;

    setActiveDashboardView("player");
    setPlayerQuery(playerName);
    await loadPlayerDashboard(playerName);
  }

  async function loadPlayerDashboard(playerName) {
    const trimmedQuery = String(playerName || "").trim();

    setPlayerLoading(true);
    setTeamLoading(true);
    setPlayerError("");
    setTeamError("");
    setSelectedGameId(null);
    setSelectedGame(null);
    setBoxScore(null);
    setBoxScoreError("");

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
      setPlayerError("");
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
      setPlayerTitle(
        playerResponse?.playerName || playerResponse?.player || trimmedQuery,
      );

      // Team load is helpful, but should not break player view
      try {
        const derivedTeamQuery = deriveTeamQuery(
          playerResponse,
          normalizedPlayerGames,
        );

        if (!derivedTeamQuery) {
          setTeamQuery("");
          setTeamGames([]);
          setTeamTitle("Team");
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
        setTeamError("");
      } catch (teamErr) {
        console.error("Team fetch failed:", teamErr);
        setTeamGames([]);
        setTeamError("Failed to load team dashboard.");
      }
    } catch (err) {
      console.error("Player fetch failed:", err);
      setPlayerError("Failed to load player dashboard.");
      setPlayerGames([]);
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
  function clearPlayerFilters() {
    setPlayerFilters(INITIAL_FILTERS);
  }

  function clearTeamFilters() {
    setTeamFilters(INITIAL_FILTERS);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-hero">
          <div className="app-hero-top">
            <div className="app-hero-copy">
              <p className="app-kicker">NBA analytics workspace</p>
              <h1 className="app-title">Basketball Stats Dashboard</h1>
              <p className="app-subtitle">
                Explore player and team trends, filter game logs, inspect box
                scores, and compare recent performance.
              </p>
            </div>

            <div className="app-hero-actions">
              <div className="segmented-group">
                <button
                  className={`segment-btn ${viewMode === "dashboard" ? "active" : ""}`}
                  onClick={() => setViewMode("dashboard")}
                >
                  Dashboard
                </button>

                <button
                  className={`segment-btn ${viewMode === "simulator" ? "active" : ""}`}
                  onClick={() => setViewMode("simulator")}
                >
                  Betting Simulator
                </button>
              </div>
            </div>
          </div>

          {viewMode === "dashboard" && (
            <div className="dashboard-view-switcher">
              <div className="segmented-group">
                <button
                  className={`segment-btn ${
                    activeDashboardView === "player" ? "active" : ""
                  }`}
                  onClick={() => setActiveDashboardView("player")}
                >
                  Player
                </button>

                <button
                  className={`segment-btn ${
                    activeDashboardView === "team" ? "active" : ""
                  }`}
                  onClick={() => setActiveDashboardView("team")}
                >
                  Team
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {viewMode === "dashboard" && (
        <DashboardCarousel
          activeDashboardView={activeDashboardView}
          setActiveDashboardView={setActiveDashboardView}
          playerView={
            <PlayerDashboardView
              title={playerTitle}
              loading={playerLoading}
              error={playerError}
              query={playerQuery}
              setQuery={setPlayerQuery}
              season={season}
              setSeason={setSeason}
              last={last}
              setLast={setLast}
              onSearch={handlePlayerSearch}
              filters={playerFilters}
              onUpdateFilter={updatePlayerFilter}
              onRemoveThresholdFilter={removePlayerThresholdFilter}
              averages={playerAverages}
              matchupOpponent={playerMatchupOpponent}
              selectedStat={playerSelectedStat}
              setSelectedStat={setPlayerSelectedStat}
              filteredGames={filteredPlayerGames}
              selectedLine={playerSelectedLine}
              propInsights={playerPropInsights}
              matchupSnapshot={playerMatchupSnapshot}
              selectedGame={selectedGame}
              selectedGameId={selectedGameId}
              onSelectGame={handleSelectGame}
              boxScore={boxScore}
              boxScoreLoading={boxScoreLoading}
              boxScoreError={boxScoreError}
              isBoxScoreOpen={isBoxScoreOpen}
              setIsBoxScoreOpen={setIsBoxScoreOpen}
              boxScoreRef={boxScoreRef}
              onToggleLocation={togglePlayerLocation}
              onToggleResult={togglePlayerResult}
              onClearFilters={clearPlayerFilters}
              onSelectPlayerFromBoxScore={handleSelectPlayerFromBoxScore}
              onSelectTeamFromBoxScore={handleSelectTeamFromBoxScore}
            />
          }
          teamView={
            <TeamDashboardView
              title={teamTitle}
              loading={teamLoading}
              error={teamError}
              query={teamQuery}
              setQuery={setTeamQuery}
              season={season}
              setSeason={setSeason}
              last={last}
              setLast={setLast}
              onSearch={handleTeamSearch}
              filters={teamFilters}
              onUpdateFilter={updateTeamFilter}
              onRemoveThresholdFilter={removeTeamThresholdFilter}
              onToggleLocation={toggleTeamLocation}
              onToggleResult={toggleTeamResult}
              onClearFilters={clearTeamFilters}
              averages={teamAverages}
              selectedStat={teamSelectedStat}
              setSelectedStat={setTeamSelectedStat}
              filteredGames={filteredTeamGames}
              propInsights={teamPropInsights}
              selectedGame={selectedGame}
              selectedGameId={selectedGameId}
              onSelectGame={handleSelectGame}
              boxScore={boxScore}
              boxScoreLoading={boxScoreLoading}
              boxScoreError={boxScoreError}
              isBoxScoreOpen={isBoxScoreOpen}
              setIsBoxScoreOpen={setIsBoxScoreOpen}
              boxScoreRef={boxScoreRef}
              onSelectPlayerFromBoxScore={handleSelectPlayerFromBoxScore}
              onSelectTeamFromBoxScore={handleSelectTeamFromBoxScore}
            />
          }
        />
      )}

      {viewMode === "simulator" && (
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
