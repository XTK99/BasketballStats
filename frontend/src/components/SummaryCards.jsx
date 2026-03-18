function SummaryCards({ averages }) {
  if (!averages) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Averages</h3>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <strong>PTS:</strong> {averages.points}
        </div>
        <div>
          <strong>REB:</strong> {averages.rebounds}
        </div>
        <div>
          <strong>AST:</strong> {averages.assists}
        </div>
        <div>
          <strong>STL:</strong> {averages.steals}
        </div>
        <div>
          <strong>BLK:</strong> {averages.blocks}
        </div>
        <div>
          <strong>TOV:</strong> {averages.turnovers}
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
