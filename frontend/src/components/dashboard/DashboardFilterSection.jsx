import FiltersBar from "../FiltersBar";
import ThresholdFilter from "../ThresholdFilter";
import ActiveFilters from "../ActiveFilters";
import "./DashboardFilterSection.css";

function DashboardFilterSection({
  filters,
  onUpdateFilter,
  onRemoveThresholdFilter,
}) {
  return (
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
        setThresholdFilters={(value) => onUpdateFilter("thresholds", value)}
      />

      <ActiveFilters
        locationFilter={filters.location}
        resultFilter={filters.result}
        opponentFilter={filters.opponent}
        thresholdFilters={filters.thresholds}
        onRemoveThresholdFilter={onRemoveThresholdFilter}
      />
    </section>
  );
}

export default DashboardFilterSection;
