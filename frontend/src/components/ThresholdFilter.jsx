function ThresholdFilter({
  thresholdStat,
  setThresholdStat,
  thresholdOperator,
  setThresholdOperator,
  thresholdValue,
  setThresholdValue,
}) {
  return (
    <section className="panel-card">
      <h3 className="panel-title">Stat Threshold</h3>

      <div className="filters-row">
        <select
          className="search-select"
          value={thresholdStat}
          onChange={(e) => setThresholdStat(e.target.value)}
        >
          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="assists">Assists</option>
          <option value="steals">Steals</option>
          <option value="blocks">Blocks</option>
          <option value="turnovers">Turnovers</option>
          <option value="threesMade">3PM</option>
          <option value="fieldGoalsMade">FGM</option>
          <option value="freeThrowsMade">FTM</option>
        </select>

        <select
          className="search-select"
          value={thresholdOperator}
          onChange={(e) => setThresholdOperator(e.target.value)}
        >
          <option value=">=">&gt;=</option>
          <option value="<=">&lt;=</option>
          <option value="=">=</option>
        </select>

        <input
          className="search-number"
          type="number"
          value={thresholdValue}
          onChange={(e) => setThresholdValue(e.target.value)}
          placeholder="Value"
        />
      </div>
    </section>
  );
}

export default ThresholdFilter;
