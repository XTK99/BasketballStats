import "./ThresholdFilter.css";
import { useState } from "react";

function ThresholdFilter({ thresholdFilters = [], setThresholdFilters }) {
  const [stat, setStat] = useState("minutes");
  const [operator, setOperator] = useState(">=");
  const [value, setValue] = useState("");

  function handleAddFilter() {
    const numericValue = Number(value);

    if (!value.trim() || Number.isNaN(numericValue)) return;

    const newFilter = {
      stat,
      operator,
      value: numericValue,
    };

    setThresholdFilters([...thresholdFilters, newFilter]);
    setValue("");
  }

  return (
    <div className="threshold-section">
      <div className="threshold-title">Stat Threshold</div>

      <div className="threshold-row">
        <select value={stat} onChange={(e) => setStat(e.target.value)}>
          <option value="minutes">Minutes</option>
          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="assists">Assists</option>
          <option value="steals">Steals</option>
          <option value="blocks">Blocks</option>
          <option value="turnovers">Turnovers</option>
          <option value="threesMade">3PM</option>
        </select>

        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value=">=">≥</option>
          <option value="<=">≤</option>
          <option value=">">{">"}</option>
          <option value="<">{"<"}</option>
          <option value="=">=</option>
        </select>

        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          type="button"
          className="add-filter-button"
          onClick={handleAddFilter}
        >
          Add Filter
        </button>
      </div>
    </div>
  );
}

export default ThresholdFilter;
