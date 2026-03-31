import { useMemo, useState } from "react";
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
import "./StatChart.css";

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
  const color = getTeamColor(teamAbbreviation);

  if (!color.startsWith("#") || color.length !== 7) {
    return color;
  }

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness < 120) {
    return `rgb(${Math.min(r + 80, 255)}, ${Math.min(
      g + 80,
      255,
    )}, ${Math.min(b + 80, 255)})`;
  }

  return color;
}

function getResultColor(result) {
  if (result === "W") return "#22c55e";
  if (result === "L") return "#ef4444";
  return "#cbd5e1";
}

function getChartStatValue(game, stat) {
  const statKeyMap = {
    minutes: ["minutes", "MIN", "min"],
    points: ["points", "PTS", "pts"],
    rebounds: ["rebounds", "REB", "reb"],
    assists: ["assists", "AST", "ast"],
    steals: ["steals", "STL", "stl"],
    blocks: ["blocks", "BLK", "blk"],
    turnovers: ["turnovers", "TOV", "tov"],
    FGM: ["fgm", "FGM"],
    FGA: ["fga", "FGA"],
    "3PM": ["fg3m", "FG3M", "3PM", "threePm", "threesMade"],
    "3PA": ["fg3a", "FG3A", "3PA", "threePa", "threesAttempted"],
    FTM: ["ftm", "FTM"],
    FTA: ["fta", "FTA"],
    "FG%": ["fgPct", "fg_pct", "FG_PCT", "fgPercentage", "fieldGoalPct"],
    "3P%": [
      "fg3Pct",
      "fg3_pct",
      "FG3_PCT",
      "fg3Percentage",
      "threePtPct",
      "threePointPct",
    ],
    "FT%": ["ftPct", "ft_pct", "FT_PCT", "ftPercentage", "freeThrowPct"],
    fieldGoalPct: ["fieldGoalPct", "fgPct", "fg_pct", "FG_PCT", "fgPercentage"],
    threePointPct: [
      "threePointPct",
      "fg3Pct",
      "fg3_pct",
      "FG3_PCT",
      "fg3Percentage",
      "threePtPct",
    ],
    freeThrowPct: ["freeThrowPct", "ftPct", "ft_pct", "FT_PCT", "ftPercentage"],
  };

  const percentageStats = new Set([
    "FG%",
    "3P%",
    "FT%",
    "fieldGoalPct",
    "threePointPct",
    "freeThrowPct",
  ]);

  const possibleKeys = statKeyMap[stat] || [stat];

  for (const key of possibleKeys) {
    const rawValue = game?.[key];

    if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
      const numericValue = Number(rawValue);

      if (!Number.isNaN(numericValue)) {
        return percentageStats.has(stat) ? numericValue * 100 : numericValue;
      }
    }
  }

  return null;
}

function formatStatLabel(stat) {
  const labels = {
    minutes: "Minutes",
    points: "Points",
    rebounds: "Rebounds",
    assists: "Assists",
    steals: "Steals",
    blocks: "Blocks",
    turnovers: "Turnovers",
    FGM: "FGM",
    FGA: "FGA",
    "3PM": "3PM",
    "3PA": "3PA",
    FTM: "FTM",
    FTA: "FTA",
    "FG%": "FG%",
    "3P%": "3P%",
    "FT%": "FT%",
    fieldGoalPct: "FG%",
    threePointPct: "3P%",
    freeThrowPct: "FT%",
  };

  return labels[stat] || stat;
}

function formatGameDate(dateString) {
  if (!dateString) return "";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(dateString);
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatFullGameDate(dateString) {
  if (!dateString) return "";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(dateString);
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

function formatTooltipValue(stat, value) {
  if (value == null) return "0";

  if (
    [
      "FG%",
      "3P%",
      "FT%",
      "fieldGoalPct",
      "threePointPct",
      "freeThrowPct",
    ].includes(stat)
  ) {
    return `${Number(value).toFixed(1)}%`;
  }

  return Number(value).toFixed(1);
}

function getSortableTimestamp(dateString, fallbackIndex = 0) {
  if (!dateString) return fallbackIndex;

  const parsed = new Date(dateString).getTime();
  if (Number.isNaN(parsed)) return fallbackIndex;

  return parsed;
}

function sortChartPointsChronologically(points) {
  return [...points].sort((a, b) => {
    const aTime = getSortableTimestamp(a.fullDate, 0);
    const bTime = getSortableTimestamp(b.fullDate, 0);
    return aTime - bTime;
  });
}

function CustomTooltip({ active, payload, selectedStat }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload;
  if (!point) return null;

  const { awayTeam, homeTeam, separator } = parseMatchupTeams(point.matchup);

  const resultLabel =
    point.wl === "W" ? "Win" : point.wl === "L" ? "Loss" : "Result unknown";

  return (
    <div className="stat-chart-tooltip">
      <div className="stat-chart-tooltip-date">
        {formatFullGameDate(point.fullDate)}
      </div>

      <div className="stat-chart-tooltip-matchup">
        <span style={{ color: getReadableTeamColor(awayTeam) }}>
          {awayTeam}
        </span>
        {separator && (
          <span className="stat-chart-tooltip-separator"> {separator} </span>
        )}
        <span style={{ color: getReadableTeamColor(homeTeam) }}>
          {homeTeam}
        </span>
        <span
          className="stat-chart-tooltip-result"
          style={{ color: getResultColor(point.wl) }}
        >
          {" "}
          • {resultLabel}
        </span>
      </div>

      {point.played === false ? (
        <div className="stat-chart-tooltip-stat">
          {formatStatLabel(selectedStat)}:{" "}
          <span className="stat-chart-tooltip-stat-value">0</span> (Did not
          play)
        </div>
      ) : (
        <div className="stat-chart-tooltip-stat">
          {formatStatLabel(selectedStat)}:{" "}
          <span className="stat-chart-tooltip-stat-value">
            {formatTooltipValue(selectedStat, point.statValue)}
          </span>
        </div>
      )}
    </div>
  );
}

function CustomDot({ cx, cy, payload, onSelectGame, selectedGameId }) {
  if (cx == null || cy == null || !payload) return null;

  const isSelected = payload.gameId === selectedGameId;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isSelected ? 6 : 4}
      className={
        isSelected ? "stat-chart-dot stat-chart-dot-selected" : "stat-chart-dot"
      }
      onClick={() => onSelectGame?.(payload.originalGame)}
    />
  );
}

function StatChart({
  data = null,
  games = [],
  selectedStat = "points",
  hitRateStat,
  hitRateLine,
  onSelectGame,
  selectedGameId,
}) {
  const [customLineInput, setCustomLineInput] = useState("");

  const safeGames = Array.isArray(games) ? games : [];
  const safeData = Array.isArray(data) ? data : null;

  const chartData = useMemo(() => {
    const mappedPoints = safeData
      ? safeData.map((point, index) => ({
          gameId: point.gameId || "",
          originalGame: point.rawGame || null,
          xLabel: formatGameDate(point.gameDate),
          fullDate: point.gameDate || "",
          statValue: Number(point.value ?? 0),
          matchup: point.matchup || "",
          played: point.played !== false,
          wl:
            point.rawGame?.wl ||
            point.rawGame?.WL ||
            (point.win === true ? "W" : point.win === false ? "L" : ""),
          _index: index,
        }))
      : safeGames.map((game, index) => {
          const played = game?.played !== false;

          return {
            gameId: game?.gameId || game?.GAME_ID || "",
            originalGame: game,
            xLabel: formatGameDate(game?.gameDate),
            fullDate: game?.gameDate || "",
            statValue: played
              ? (getChartStatValue(game, selectedStat) ?? 0)
              : 0,
            matchup: game?.matchup || game?.MATCHUP || "",
            played,
            wl: game?.wl || game?.WL || "",
            _index: index,
          };
        });

    return sortChartPointsChronologically(mappedPoints);
  }, [safeData, safeGames, selectedStat]);

  const trimmedCustomLineInput = String(customLineInput).trim();
  const hasCustomLineInput = trimmedCustomLineInput !== "";
  const numericCustomLine = Number(trimmedCustomLineInput);

  const showCustomLine =
    hasCustomLineInput && Number.isFinite(numericCustomLine);

  const numericHitRateLine = Number(hitRateLine);
  const showPropLine =
    selectedStat === hitRateStat &&
    hitRateLine !== "" &&
    Number.isFinite(numericHitRateLine);

  return (
    <div className="stat-chart">
      <div className="stat-chart-header">
        <div>
          <h3 className="panel-title stat-chart-title">
            {formatStatLabel(selectedStat)} Trend
          </h3>
          <p className="stat-chart-subtitle">Season game-by-game performance</p>
        </div>
      </div>

      <div className="stat-chart-controls">
        <label className="stat-chart-input-group">
          <span className="stat-chart-input-label">Custom line</span>
          <input
            className="stat-chart-input"
            type="number"
            value={customLineInput}
            onChange={(e) => setCustomLineInput(e.target.value)}
            placeholder={`Enter ${formatStatLabel(selectedStat)} line`}
          />
        </label>

        <button
          type="button"
          className="stat-chart-clear-button"
          onClick={() => setCustomLineInput("")}
        >
          Clear
        </button>
      </div>

      <div className="stat-chart-canvas">
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

            {showCustomLine && (
              <ReferenceLine
                y={numericCustomLine}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="8 4"
                label={{
                  value: `Custom ${numericCustomLine}`,
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="statValue"
              stroke="#60a5fa"
              strokeWidth={3}
              connectNulls={false}
              dot={(dotProps) => (
                <CustomDot
                  {...dotProps}
                  onSelectGame={onSelectGame}
                  selectedGameId={selectedGameId}
                />
              )}
              activeDot={(dotProps) => (
                <CustomDot
                  {...dotProps}
                  onSelectGame={onSelectGame}
                  selectedGameId={selectedGameId}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatChart;
