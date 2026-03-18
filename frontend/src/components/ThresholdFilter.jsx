function ThresholdFilter({
  thresholdStat,
  setThresholdStat,
  thresholdOperator,
  setThresholdOperator,
  thresholdValue,
  setThresholdValue,
  onAddFilter,
}) {
  function handleThresholdWheel(e) {
    e.preventDefault();

    const current = Number(thresholdValue || 0);
    const nextValue = e.deltaY < 0 ? current + 1 : current - 1;

    setThresholdValue(String(Math.max(0, nextValue)));
  }

  return (
    <section className="panel-card">
      <h3 className="panel-title">Stat Threshold</h3>

      <div className="threshold-controls">
        <select
          className="threshold-control threshold-select"
          value={thresholdStat}
          onChange={(e) => setThresholdStat(e.target.value)}
        >
          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="assists">Assists</option>
          <option value="steals">Steals</option>
          <option value="blocks">Blocks</option>
          <option value="turnovers">Turnovers</option>
          <option value="FGM">FGM</option>
          <option value="FGA">FGA</option>
          <option value="3PM">3PM</option>
          <option value="3PA">3PA</option>
        </select>

        <select
          className="threshold-control threshold-operator"
          value={thresholdOperator}
          onChange={(e) => setThresholdOperator(e.target.value)}
        >
          <option value=">=">{">="}</option>
          <option value="<=">{"<="}</option>
          <option value=">">{">"}</option>
          <option value="<">{"<"}</option>
          <option value="=">{"="}</option>
        </select>

        <div onWheel={handleThresholdWheel}>
          <input
            className="threshold-control threshold-input"
            type="text"
            inputMode="numeric"
            value={thresholdValue}
            onChange={(e) =>
              setThresholdValue(e.target.value.replace(/[^\d]/g, ""))
            }
            onWheelCapture={handleThresholdWheel}
            onWheel={handleThresholdWheel}
            placeholder="Value"
          />
        </div>

        <button
          type="button"
          className="threshold-add-button"
          onClick={onAddFilter}
        >
          Add Filter
        </button>
      </div>
    </section>
  );
}

export default ThresholdFilter;
