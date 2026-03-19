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

const TEAM_COLORS = {
  ATL: "#E03A3E",
  BOS: "#007A33",
  BKN: "#000000",
  CHA: "#1D1160",
  CHI: "#CE1141",
  CLE: "#860038",
  DAL: "#00538C",
  DEN: "#0E2240",
  DET: "#C8102E",
  GSW: "#1D428A",
  HOU: "#CE1141",
  IND: "#002D62",
  LAC: "#C8102E",
  LAL: "#FDB927",
  MEM: "#5D76A9",
  MIA: "#98002E",
  MIL: "#00471B",
  MIN: "#0C2340",
  NOP: "#0C2340",
  NYK: "#006BB6",
  OKC: "#007AC1",
  ORL: "#0077C0",
  PHI: "#006BB6",
  PHX: "#1D1160",
  POR: "#E03A3E",
  SAC: "#5A2D81",
  SAS: "#C4CED4",
  TOR: "#CE1141",
  UTA: "#002B5C",
  WAS: "#002B5C",
};

function getTeamColor(teamAbbreviation) {
  return TEAM_COLORS[teamAbbreviation] || "#f8fafc";
}

function getReadableTeamColor(teamAbbreviation) {
  const darkTeams = new Set(["BKN", "DEN", "MIN", "NOP", "UTA", "WAS", "CLE"]);

  if (darkTeams.has(teamAbbreviation)) {
    return "#93c5fd";
  }

  if (teamAbbreviation === "LAL") {
    return "#facc15";
  }

  if (teamAbbreviation === "SAS") {
    return "#e5e7eb";
  }

  return getTeamColor(teamAbbreviation);
}

function getResultColor(result) {
  if (result === "W") return "#22c55e";
  if (result === "L") return "#ef4444";
  return "#cbd5e1";
}

function getChartStatValue(game, stat) {
  const statKeyMap = {
    points: ["points", "PTS", "pts"],
    rebounds: ["rebounds", "REB", "reb"],
    assists: ["assists", "AST", "ast"],
    steals: ["steals", "STL", "stl"],
    blocks: ["blocks", "BLK", "blk"],
    turnovers: ["turnovers", "TOV", "tov"],
    minutes: ["minutes", "MIN", "min"],
    FGM: ["fgm", "FGM"],
    FGA: ["fga", "FGA"],
    "3PM": ["fg3m", "FG3M", "3PM", "threePm"],
    "3PA": ["fg3a", "FG3A", "3PA", "threePa"],
    FTM: ["ftm", "FTM"],
    FTA: ["fta", "FTA"],
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

  return null;
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

function formatGameDate(dateString) {
  if (!dateString) return "";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseMatchupTeams(matchup = "") {
  if (!matchup || typeof matchup !== "string") {
    return { awayTeam: "", homeTeam: "", separator: "" };
  }

  if (matchup.includes(" @ ")) {
    const [awayTeam, homeTeam] = matchup.split(" @ ");
    return {
      awayTeam: awayTeam || "",
      homeTeam: homeTeam || "",
      separator: "@",
    };
  }

  if (matchup.includes(" vs. ")) {
    const [homeTeam, awayTeam] = matchup.split(" vs. ");
    return {
      awayTeam: awayTeam || "",
      homeTeam: homeTeam || "",
      separator: "vs.",
    };
  }

  return { awayTeam: "", homeTeam: "", separator: "" };
}

function formatGameScore(teamScore, opponentScore) {
  if (
    teamScore === null ||
    teamScore === undefined ||
    opponentScore === null ||
    opponentScore === undefined
  ) {
    return "Score unavailable";
  }

  return `${teamScore} - ${opponentScore}`;
}

function CustomTooltip({ active, payload, selectedStat }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;
  const { awayTeam, homeTeam, separator } = parseMatchupTeams(point.matchup);

  const resultLabel =
    point.wl === "W" ? "Win" : point.wl === "L" ? "Loss" : "Result unknown";

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        color: "#fff",
        padding: "10px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        minWidth: "220px",
      }}
    >
      <div style={{ marginBottom: 6, color: "#e2e8f0", fontSize: 13 }}>
        {formatGameDate(point.fullDate)}
      </div>

      <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
        <span style={{ color: getReadableTeamColor(awayTeam) }}>
          {awayTeam}
        </span>
        {separator && <span style={{ color: "#cbd5e1" }}> {separator} </span>}
        <span style={{ color: getReadableTeamColor(homeTeam) }}>
          {homeTeam}
        </span>
        <span style={{ color: getResultColor(point.wl) }}>
          {" "}
          • {resultLabel}
        </span>
      </div>

      <div style={{ marginBottom: 6, fontSize: 14, color: "#cbd5e1" }}>
        Score:{" "}
        <span style={{ color: "#f8fafc", fontWeight: 600 }}>
          {formatGameScore(point.teamScore, point.opponentScore)}
        </span>
      </div>

      {point.played === false ? (
        <div style={{ color: "#f8fafc", fontSize: 14 }}>Did not play</div>
      ) : (
        <div style={{ color: "#60a5fa", fontSize: 14 }}>
          {formatStatLabel(selectedStat)}:{" "}
          <span style={{ color: "#f8fafc", fontWeight: 600 }}>
            {point.statValue}
          </span>
        </div>
      )}
    </div>
  );
}

function StatChart({ games, selectedStat, hitRateStat, hitRateLine }) {
  const chartData = games.map((game) => ({
    xLabel: formatGameDate(game.gameDate),
    fullDate: game.gameDate || "",
    statValue:
      game.played === false ? null : getChartStatValue(game, selectedStat),
    matchup: game.matchup || game.MATCHUP || "",
    played: game.played !== false,
    seasonGameNumber: game.seasonGameNumber || null,
    wl: game.wl || game.WL || "",
    teamScore: game.teamScore ?? null,
    opponentScore: game.opponentScore ?? null,
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
          <p className="chart-subtitle">Season game-by-game performance</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="xLabel"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            minTickGap={24}
          />
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip selectedStat={selectedStat} />} />

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
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatChart;
