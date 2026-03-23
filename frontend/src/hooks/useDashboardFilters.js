import { useState } from "react";

export const INITIAL_FILTERS = {
  locations: ["home", "away"],
  results: ["win", "loss"],
  opponent: "",
  thresholds: [],
};

function buildFreshFilters() {
  return {
    locations: [...INITIAL_FILTERS.locations],
    results: [...INITIAL_FILTERS.results],
    opponent: "",
    thresholds: [],
  };
}

function toggleFilterValue(values, target) {
  if (values.includes(target)) {
    if (values.length === 1) return values;
    return values.filter((value) => value !== target);
  }

  return [...values, target];
}

export function useDashboardFilters() {
  const [filters, setFilters] = useState(buildFreshFilters);

  function updateFilter(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function removeThresholdFilter(indexToRemove) {
    setFilters((prev) => ({
      ...prev,
      thresholds: prev.thresholds.filter((_, index) => index !== indexToRemove),
    }));
  }

  function toggleLocation(location) {
    setFilters((prev) => ({
      ...prev,
      locations: toggleFilterValue(prev.locations, location),
    }));
  }

  function toggleResult(result) {
    setFilters((prev) => ({
      ...prev,
      results: toggleFilterValue(prev.results, result),
    }));
  }

  function clearFilters() {
    setFilters(buildFreshFilters());
  }

  function resetFilters() {
    setFilters(buildFreshFilters());
  }

  return {
    filters,
    setFilters,
    updateFilter,
    removeThresholdFilter,
    toggleLocation,
    toggleResult,
    clearFilters,
    resetFilters,
  };
}
