import "./SummaryCards.css";

const CARDS = [
  { key: "points", label: "PTS" },
  { key: "rebounds", label: "REB" },
  { key: "assists", label: "AST" },
  { key: "steals", label: "STL" },
  { key: "blocks", label: "BLK" },
  { key: "turnovers", label: "TOV" },
  { key: "threesMade", label: "3PM" },
  { key: "minutes", label: "MIN" },
];

function formatValue(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.0";
  return num.toFixed(1);
}

function SummaryCards({ averages, selectedStat, onSelectStat }) {
  if (!averages) return null;

  return (
    <section className="summary-grid">
      {CARDS.map((card) => (
        <button
          key={card.key}
          type="button"
          className={`summary-card ${
            selectedStat === card.key ? "summary-card-active" : ""
          }`}
          onClick={() => onSelectStat(card.key)}
        >
          <div className="summary-label">{card.label}</div>
          <div className="summary-value">{formatValue(averages[card.key])}</div>
        </button>
      ))}
    </section>
  );
}

export default SummaryCards;
