import { useState } from "react";
import "./ThresholdFilter.css";

const STAT_OPTIONS = [
  { value: "minutes", label: "Minutes" },
  { value: "points", label: "Points" },
  { value: "rebounds", label: "Rebounds" },
  { value: "assists", label: "Assists" },
  { value: "steals", label: "Steals" },
  { value: "blocks", label: "Blocks" },
  { value: "turnovers", label: "Turnovers" },
  { value: "threesMade", label: "3PM" },
];

const OPERATOR_OPTIONS = [
  { value: ">=", label: "≥" },
  { value: "<=", label: "≤" },
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
];

function ThresholdFilter({ thresholdFilters, setThresholdFilters }) {
  const [stat, setStat] = useState("minutes");
  const [operator, setOperator] = useState(">=");
  const [value, setValue] = useState("");

  function handleAddFilter() {
    const numericValue = Number(value);

    if (!value || Number.isNaN(numericValue)) return;

    setThresholdFilters([
      ...thresholdFilters,
      { stat, operator, value: numericValue },
    ]);

    setValue("");
  }

  return (
    <div className="threshold-filter">
      <h3 className="panel-title">Stat Threshold</h3>

      <div className="threshold-controls">
        <select
          className="threshold-select"
          value={stat}
          onChange={(e) => setStat(e.target.value)}
        >
          {STAT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="threshold-select threshold-operator"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          {OPERATOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          className="threshold-input"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
        />

        <button className="threshold-button" onClick={handleAddFilter}>
          Add Filter
        </button>
      </div>
    </div>
  );
}

export default ThresholdFilter;
