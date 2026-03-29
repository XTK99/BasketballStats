function FilterChips({
  location,
  result,
  opponent,
  threshold,
  onRemoveLocation,
  onRemoveResult,
  onRemoveOpponent,
  onRemoveThreshold,
}) {
  const chips = [];

  if (location && location !== "all") {
    chips.push({
      key: "location",
      label: location === "home" ? "Home" : "Away",
      onRemove: onRemoveLocation,
    });
  }

  if (result && result !== "all") {
    chips.push({
      key: "result",
      label: result === "win" ? "Wins" : "Losses",
      onRemove: onRemoveResult,
    });
  }

  if (opponent?.trim()) {
    chips.push({
      key: "opponent",
      label: `vs ${opponent.toUpperCase()}`,
      onRemove: onRemoveOpponent,
    });
  }

  if (threshold && threshold.value !== "") {
    const statLabelMap = {
      points: "PTS",
      rebounds: "REB",
      assists: "AST",
      steals: "STL",
      blocks: "BLK",
      turnovers: "TOV",
      minutes: "MIN",
    };

    chips.push({
      key: "threshold",
      label: `${statLabelMap[threshold.stat] || threshold.stat} ${threshold.operator} ${threshold.value}`,
      onRemove: onRemoveThreshold,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="filter-chips">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="filter-chip"
          onClick={chip.onRemove}
        >
          <span>{chip.label}</span>
          <span className="filter-chip-x">×</span>
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
