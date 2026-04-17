import React, { useState } from "react";

export default function Table({ data = [], onCellClick }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  if (!data.length) return null;

  const headers = Object.keys(data[0]);
  const allHeaders = ["#", ...headers];

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortKey] === b[sortKey]) return 0;
      if (a[sortKey] == null) return 1;
      if (b[sortKey] == null) return -1;
      if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") {
        return sortDir === "asc"
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey];
      }
      return sortDir === "asc"
        ? String(a[sortKey]).localeCompare(String(b[sortKey]))
        : String(b[sortKey]).localeCompare(String(a[sortKey]));
    });
    return sorted;
  }, [data, sortKey, sortDir]);

  const handleHeaderClick = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `60px repeat(${headers.length}, 1fr)`,
          borderBottom: "2px solid #e0e0e0",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 500,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            userSelect: "none",
            background: "#f1f5f9",
          }}
        >
          #
        </div>
        {headers.map((key) => (
          <div
            key={key}
            onClick={() => handleHeaderClick(key)}
            style={{
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 500,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              userSelect: "none",
              cursor: "pointer",
              background: sortKey === key ? "#f1f5f9" : "transparent",
            }}
            title="Sort"
          >
            {key}
            {sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : null}
          </div>
        ))}
      </div>

      {/* Data rows */}
      {sortedData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: `60px repeat(${headers.length}, 1fr)`,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              fontSize: 13,
              color: "#64748b",
              background: "#f8fafc",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              userSelect: "none",
            }}
          >
            {rowIndex + 1}
          </div>
          {headers.map((key) => (
            <div
              key={key}
              onClick={() =>
                onCellClick?.({ value: row[key], column: key, rowIndex, row })
              }
              style={{
                padding: "10px 14px",
                fontSize: 14,
                color: "#222",
                cursor: onCellClick ? "pointer" : "default",
                transition: "background 0.1s",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onMouseEnter={(e) => {
                if (onCellClick) e.currentTarget.style.background = "#f7f7f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {row[key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
