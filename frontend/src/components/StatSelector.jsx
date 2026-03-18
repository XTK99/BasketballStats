function StatSelector({ selectedStat, setSelectedStat }) {
  return (
    <>
      <h3 className="panel-title">Trend Chart</h3>

      <select
        className="search-select"
        value={selectedStat}
        onChange={(e) => setSelectedStat(e.target.value)}
      >
        <option value="minutes">Minutes</option>
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
    </>
  );
}

export default StatSelector;
