import { useState, useEffect, useRef, useCallback } from "react";

const PALETTE = [
  ["#534AB7", "#7F77DD", "#AFA9EC"],
  ["#0F6E56", "#1D9E75", "#5DCAA5"],
  ["#993C1D", "#D85A30", "#F0997B"],
  ["#185FA5", "#378ADD", "#85B7EB"],
  ["#3B6D11", "#639922", "#97C459"],
  ["#854F0B", "#BA7517", "#EF9F27"],
  ["#993556", "#D4537E", "#ED93B1"],
];

function pickColor(c, r) {
  const pi = (c * 3 + r * 2) % PALETTE.length;
  return PALETTE[pi][(c + r) % 3];
}

export default function DynamicGrid() {
  const [cellSize, setCellSize] = useState(48);
  const [gap, setGap] = useState(4);
  const [grid, setGrid] = useState({ cols: 1, rows: 1, cells: [] });
  const wrapRef = useRef(null);

  const recalc = useCallback(
    (containerWidth) => {
      // Columns derive from fixed cell size — not the other way around
      const cols = Math.max(
        1,
        Math.floor((containerWidth + gap) / (cellSize + gap)),
      );
      const rows = Math.max(
        2,
        Math.round((window.innerHeight * 0.45) / (cellSize + gap)),
      );
      const cells = Array.from({ length: cols * rows }, (_, i) => ({
        id: i,
        color: pickColor(i % cols, Math.floor(i / cols)),
      }));
      setGrid({ cols, rows, cells });
    },
    [cellSize, gap],
  );

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) =>
      recalc(entries[0].contentRect.width),
    );
    ro.observe(wrapRef.current);
    recalc(wrapRef.current.offsetWidth);
    return () => ro.disconnect();
  }, [recalc]);

  const handleCellClick = (id) => {
    setGrid((prev) => ({
      ...prev,
      cells: prev.cells.map((cell) =>
        cell.id === id
          ? {
              ...cell,
              color: pickColor(
                Math.floor(Math.random() * prev.cols),
                Math.floor(Math.random() * prev.rows),
              ),
            }
          : cell,
      ),
    }));
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem 0" }}>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        <label style={{ fontSize: 13, color: "#888" }}>Cell size</label>
        <input
          type="range"
          min={20}
          max={120}
          step={1}
          value={cellSize}
          onChange={(e) => setCellSize(Number(e.target.value))}
          style={{ width: 140 }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, minWidth: 40 }}>
          {cellSize}px
        </span>

        <label style={{ fontSize: 13, color: "#888", marginLeft: 8 }}>
          Gap
        </label>
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={gap}
          onChange={(e) => setGap(Number(e.target.value))}
          style={{ width: 100 }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, minWidth: 36 }}>
          {gap}px
        </span>
      </div>

      {/* Grid — columns auto-fit from fixed cell size */}
      <div
        ref={wrapRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid.cols}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {grid.cells.map((cell) => (
          <div
            key={cell.id}
            onClick={() => handleCellClick(cell.id)}
            style={{
              width: cellSize,
              height: cellSize,
              background: cell.color,
              borderRadius: 4,
              cursor: "pointer",
              transition: "transform 0.15s, background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(0.88)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ))}
      </div>

      {/* Info bar */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {[
          `${cellSize} × ${cellSize}px fixed`,
          `${grid.cols} cols auto-fit`,
          `${grid.cols} × ${grid.rows} = ${grid.cols * grid.rows} cells`,
        ].map((label) => (
          <span
            key={label}
            style={{
              fontSize: 12,
              color: "#888",
              background: "#f3f3f3",
              padding: "4px 10px",
              borderRadius: 6,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
