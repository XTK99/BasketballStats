import { useState, useEffect, useRef, useCallback } from "react";

export default function DynamicGrid({ children, cellSize = 48, gap = 4 }) {
  const wrapRef = useRef(null);
  const [layout, setLayout] = useState({ cols: 1, rows: 1 });

  const recalc = useCallback(() => {
    if (!wrapRef.current) return;
    const containerWidth = wrapRef.current.offsetWidth;
    const containerHeight =
      wrapRef.current.parentElement?.offsetHeight ?? window.innerHeight;
    const cols = Math.max(
      1,
      Math.floor((containerWidth + gap) / (cellSize + gap)),
    );
    const rows = Math.max(
      1,
      Math.floor((containerHeight + gap) / (cellSize + gap)),
    );
    setLayout({ cols, rows });
  }, [cellSize, gap]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(wrapRef.current);
    // Also watch the parent so height changes are caught
    if (wrapRef.current.parentElement)
      ro.observe(wrapRef.current.parentElement);
    return () => ro.disconnect();
  }, [recalc]);

  const items = Array.isArray(children) ? children.flat() : [children];
  const visibleCount = layout.cols * layout.rows;
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div
      ref={wrapRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${layout.cols}, ${cellSize}px)`,
        gap: `${gap}px`,
        overflow: "hidden",
      }}
    >
      {visibleItems.map((child, i) => (
        <div
          key={i}
          style={{
            width: cellSize,
            height: cellSize,
            borderRadius: 4,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
