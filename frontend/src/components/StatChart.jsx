import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statLabels = {
  points: "Points",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",
  fieldGoalPct: "Field Goal %",
  threePointPct: "3 Point %",
  freeThrowPct: "Free Throw %",
};

function StatChart({ games, selectedStat }) {
  if (!games || games.length === 0) return null;

  const chartData = [...games].reverse().map((game) => ({
    date: game.date,
    matchup: game.matchup,
    value: game[selectedStat],
  }));

  return (
    <div style={{ width: "100%", height: 320, marginBottom: "24px" }}>
      <h3>{statLabels[selectedStat] || selectedStat} Trend</h3>

      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatChart;
