import FiltersBar from "../../FiltersBar";
import ThresholdFilter from "../../ThresholdFilter";
import ActiveFilters from "../../ActiveFilters";
import "./DashboardFilterSection.css";

function DashboardFilterSection({
  filters,
  onUpdateFilter,
  onRemoveThresholdFilter,
  onToggleLocation,
  onToggleResult,
  onClearFilters,
}) {
  return (
    <section className="panel-card dashboard-filter-section">
      <FiltersBar
        locations={filters.locations}
        results={filters.results}
        onToggleLocation={onToggleLocation}
        onToggleResult={onToggleResult}
        onClearFilters={onClearFilters}
      />

      <ThresholdFilter
        thresholdFilters={filters.thresholds}
        setThresholdFilters={(value) => onUpdateFilter("thresholds", value)}
      />

      <ActiveFilters
        locations={filters.locations}
        results={filters.results}
        thresholdFilters={filters.thresholds}
        onRemoveThresholdFilter={onRemoveThresholdFilter}
      />
    </section>
  );
}

export default DashboardFilterSection;
