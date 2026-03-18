function SummaryCards({ averages }) {
  if (!averages) return null;

  const cards = [
    { label: "PTS", value: averages.points },
    { label: "REB", value: averages.rebounds },
    { label: "AST", value: averages.assists },
    { label: "STL", value: averages.steals },
    { label: "BLK", value: averages.blocks },
    { label: "TOV", value: averages.turnovers },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className="summary-card">
          <div className="summary-label">{card.label}</div>
          <div className="summary-value">{card.value}</div>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;
