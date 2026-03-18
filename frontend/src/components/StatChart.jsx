import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatChart({ games, selectedStat }) {
  if (!games || games.length === 0) return null;

  const statLabels = {
    points: "Points",
    rebounds: "Rebounds",
    assists: "Assists",
    steals: "Steals",
    blocks: "Blocks",
    turnovers: "Turnovers",
    fieldGoalPct: "Field Goal %",
    threePointPct: "Three Point %",
    freeThrowPct: "Free Throw %",
  };

  const chartData = [...games].reverse().map((game) => ({
    date: game.date,
    matchup: game.matchup,
    value: game[selectedStat],
  }));

  return (
    <div style={{ width: "100%", height: 320, marginTop: 16 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value) => [
              value,
              statLabels[selectedStat] || selectedStat,
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatChart;
