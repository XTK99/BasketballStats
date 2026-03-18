import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function getChartStatValue(game, stat) {
  const statKeyMap = {
    points: ["points", "PTS", "pts"],
    rebounds: ["rebounds", "REB", "reb"],
    assists: ["assists", "AST", "ast"],
    steals: ["steals", "STL", "stl"],
    blocks: ["blocks", "BLK", "blk"],
    turnovers: ["turnovers", "TOV", "tov"],
    FGM: ["FGM", "fgm"],
    FGA: ["FGA", "fga"],
    "3PM": ["FG3M", "fg3m", "3PM", "threePm"],
    "3PA": ["FG3A", "fg3a", "3PA", "threePa"],
    FTM: ["FTM", "ftm"],
    FTA: ["FTA", "fta"],
  };

  const possibleKeys = statKeyMap[stat] || [stat];

  for (const key of possibleKeys) {
    const rawValue = game[key];
    if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
      const numericValue = Number(rawValue);
      if (!Number.isNaN(numericValue)) {
        return numericValue;
      }
    }
  }

  return 0;
}

function formatStatLabel(stat) {
  const labels = {
    points: "Points",
    rebounds: "Rebounds",
    assists: "Assists",
    steals: "Steals",
    blocks: "Blocks",
    turnovers: "Turnovers",
    minutes: "Minutes",
    FGM: "FGM",
    FGA: "FGA",
    "3PM": "3PM",
    "3PA": "3PA",
    FTM: "FTM",
    FTA: "FTA",
  };

  return labels[stat] || stat;
}

function StatChart({ games, selectedStat, hitRateStat, hitRateLine }) {
  const chartData = games.map((game, index) => ({
    name: `Game ${games.length - index}`,
    statValue: getChartStatValue(game, selectedStat),
    matchup: game.matchup || game.MATCHUP || "",
    gameDate: game.gameDate || game.GAME_DATE || "",
  }));

  const showPropLine =
    selectedStat === hitRateStat &&
    hitRateLine !== "" &&
    !Number.isNaN(Number(hitRateLine));

  const numericHitRateLine = Number(hitRateLine);

  return (
    <div>
      <div className="chart-header">
        <div>
          <h3 className="panel-title" style={{ marginBottom: 4 }}>
            {formatStatLabel(selectedStat)} Trend
          </h3>
          <p className="chart-subtitle">Recent game-by-game performance</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value) => [value, formatStatLabel(selectedStat)]}
            labelFormatter={(_, payload) => {
              if (!payload || !payload.length) return "";
              const point = payload[0].payload;
              return `${point.gameDate} • ${point.matchup}`;
            }}
          />

          {showPropLine && (
            <ReferenceLine
              y={numericHitRateLine}
              stroke="#f59e0b"
              strokeDasharray="6 6"
              label={{
                value: `Line ${numericHitRateLine}`,
                position: "insideTopRight",
                fill: "#f59e0b",
                fontSize: 12,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="statValue"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={{ r: 4, fill: "#60a5fa" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatChart;
