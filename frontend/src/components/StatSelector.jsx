function StatSelector({ selectedStat, setSelectedStat }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor="stat-select" style={{ marginRight: "8px" }}>
        Select Stat:
      </label>

      <select
        id="stat-select"
        value={selectedStat}
        onChange={(e) => setSelectedStat(e.target.value)}
      >
        <option value="points">Points</option>
        <option value="rebounds">Rebounds</option>
        <option value="assists">Assists</option>
        <option value="steals">Steals</option>
        <option value="blocks">Blocks</option>
        <option value="turnovers">Turnovers</option>
        <option value="fieldGoalPct">FG%</option>
        <option value="threePointPct">3P%</option>
        <option value="freeThrowPct">FT%</option>
      </select>
    </div>
  );
}

export default StatSelector;
