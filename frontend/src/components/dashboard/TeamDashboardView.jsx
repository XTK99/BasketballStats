import DashboardHeaderCard from "./DashboardHeaderCard";
import DashboardFilterSection from "./DashboardFilterSection";
import SearchBar from "../SearchBar";
import SummaryCards from "../SummaryCards";
import MatchupSnapshot from "../MatchupSnapshot";
import PropEdgeCard from "../PropEdgeCard";
import SplitsPanel from "../SplitsPanel";
import StatSelector from "../StatSelector";
import StatChart from "../StatChart";
import HitRateBoard from "../HitRateBoard";
import "./TeamDashboardView.css";

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

function TeamDashboardView({
  title,
  loading,
  error,
  query,
  setQuery,
  season,
  setSeason,
  last,
  setLast,
  onSearch,
  filters,
  onUpdateFilter,
  onRemoveThresholdFilter,
  onToggleLocation,
  onToggleResult,
  onClearFilters,
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
}) {
  return (
    <div className="section-stack">
      <DashboardHeaderCard heading="Team Dashboard" title={title}>
        <SearchBar
          mode="team"
          searchValue={query}
          setSearchValue={setQuery}
          season={season}
          setSeason={setSeason}
          last={last}
          setLast={setLast}
          onSearch={onSearch}
          showSearchButton={false}
        />
      </DashboardHeaderCard>

      {loading && <p className="status-message">Loading team dashboard...</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {!loading && !error && (
        <>
          <DashboardFilterSection
            filters={filters}
            onUpdateFilter={onUpdateFilter}
            onRemoveThresholdFilter={onRemoveThresholdFilter}
            onToggleLocation={onToggleLocation}
            onToggleResult={onToggleResult}
            onClearFilters={onClearFilters}
          />

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
            <StatChart
              games={filteredGames}
              selectedStat={selectedStat}
              mode="team"
            />
          </section>

          <HitRateBoard
            games={filteredGames}
            selectedStat={selectedStat}
            boardStat={boardStat}
            setBoardStat={setBoardStat}
            mode="team"
          />
        </>
      )}
    </div>
  );
}

export default TeamDashboardView;
