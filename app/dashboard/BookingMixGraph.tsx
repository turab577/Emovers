import React, { useMemo, useRef, useState, useEffect } from "react";
import type { UserGraphRange, BookingGraphPoint } from "../api/dashboard/types";

const graphFilters: UserGraphRange[] = ["weekly", "monthly", "yearly"];

const VB_W = 560;
const VB_H = 180;
const PAD_T = 20;
const PAD_B = 15;
const PAD_L = 8;
const PAD_R = 8;

function formatPeriodLabel(period: string) {
  if (!period) return "-";
  const parts = period.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (parts.length === 2) {
    const [year, month] = parts;
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  }
  return period;
}

type TooltipState = {
  x: number;
  y: number;
  flipped: boolean;
  value: number;
  label: string;
  type: "Moving" | "Storage";
};

interface BookingMixGraphProps {
  data: BookingGraphPoint[];
  loading: boolean;
  range: UserGraphRange;
  onRangeChange: (range: UserGraphRange) => void;
}

const MOVING_COLOR = "#378add";
const STORAGE_COLOR = "#1d9e75";

const BookingMixGraph: React.FC<BookingMixGraphProps> = ({
  data,
  loading,
  range,
  onRangeChange,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [range]);

  const items = Array.isArray(data) && data.length > 0 ? data : [];
  const labels = items.map((d) => formatPeriodLabel(d.period));

  const maxVal = useMemo(
    () => Math.max(...items.map((d) => Math.max(d.moving, d.storage)), 1),
    [items]
  );

  const visibleLabels = useMemo(() => {
    if (labels.length <= 8) return labels;
    const step = (labels.length - 1) / 6;
    const indices = new Set(
      Array.from({ length: 7 }, (_, i) => Math.round(i * step))
    );
    return labels.map((l, i) => (indices.has(i) ? l : ""));
  }, [labels]);

  const plotW = VB_W - PAD_L - PAD_R;
  const plotH = VB_H - PAD_T - PAD_B;
  const barW = items.length > 1 ? Math.max(4, Math.min(14, plotW / items.length / 2.5)) : 20;
  const gap = barW * 0.5;

  const TOOLTIP_H = 62;

  const handleBarEnter = (
    e: React.MouseEvent<SVGRectElement>,
    svgX: number,
    svgY: number,
    value: number,
    label: string,
    type: "Moving" | "Storage"
  ) => {
    if (!svgRef.current || !wrapRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / VB_W;
    const scaleY = svgRect.height / VB_H;
    const px = svgX * scaleX + (svgRect.left - wrapRect.left);
    const py = svgY * scaleY + (svgRect.top - wrapRect.top);
    setTooltip({
      x: px,
      y: py,
      flipped: py < TOOLTIP_H + 8,
      value,
      label,
      type,
    });
  };

  return (
    <div
      style={{
        background: "#f4f4f4",
        borderRadius: 16,
        padding: "20px 24px 16px",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            Booking Mix
          </p>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
            Moving vs Storage
          </p>
        </div>

        {/* Legend + Filter row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
              { color: MOVING_COLOR, label: "Moving" },
              { color: STORAGE_COLOR, label: "Storage" },
            ].map((l) => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-secondary)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: "inline-block" }} />
                {l.label}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "var(--color-background-secondary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {graphFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onRangeChange(f)}
                style={{
                  fontFamily: "inherit",
                  fontSize: 12,
                  fontWeight: 500,
                  color: range === f ? "#185fa5" : "var(--color-text-secondary)",
                  background: range === f ? "#e6f1fb" : "transparent",
                  border: range === f ? "0.5px solid #b5d4f4" : "0.5px solid transparent",
                  borderRadius: 6,
                  padding: "5px 12px",
                  cursor: "pointer",
                  transition: "all .15s ease",
                  textTransform: "capitalize",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
        {loading ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
            No data available
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              style={{ width: "100%", height: 200, overflow: "visible" }}
              preserveAspectRatio="none"
              role="img"
              aria-label="Booking mix bar chart"
            >
              <defs>
                <style>{`
                  @keyframes bmBarGrow_${animKey} {
                    from { transform: scaleY(0); }
                    to   { transform: scaleY(1); }
                  }
                `}</style>
              </defs>

              {/* Grid lines */}
              {[PAD_T, PAD_T + plotH * 0.33, PAD_T + plotH * 0.66, PAD_T + plotH].map((y, i) => (
                <line
                  key={y}
                  x1={PAD_L}
                  y1={y}
                  x2={VB_W - PAD_R}
                  y2={y}
                  stroke="var(--color-border-tertiary)"
                  strokeWidth="0.5"
                  strokeDasharray={i === 0 || i === 3 ? undefined : "4 5"}
                />
              ))}

              {/* Bars */}
              {items.map((item, idx) => {
                const cx =
                  items.length === 1
                    ? VB_W / 2
                    : PAD_L + (idx / (items.length - 1)) * plotW;

                const movingH = (item.moving / maxVal) * plotH;
                const storageH = (item.storage / maxVal) * plotH;
                const baseY = PAD_T + plotH;

                const movingX = cx - gap / 2 - barW;
                const storageX = cx + gap / 2;

                return (
                  <g key={item.period}>
                    {/* Moving bar */}
                    <rect
                      x={movingX}
                      y={baseY - movingH}
                      width={barW}
                      height={movingH}
                      fill={MOVING_COLOR}
                      rx={3}
                      opacity={item.moving === 0 ? 0.15 : 1}
                      style={{
                        transformOrigin: `${movingX + barW / 2}px ${baseY}px`,
                        animation: `bmBarGrow_${animKey} 0.5s cubic-bezier(.4,0,.2,1) ${idx * 0.04}s both`,
                        transition: "opacity .15s",
                      }}
                      onMouseEnter={(e) =>
                        handleBarEnter(e, cx - gap / 2 - barW / 2, baseY - movingH - 4, item.moving, labels[idx], "Moving")
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                    {/* Storage bar */}
                    <rect
                      x={storageX}
                      y={baseY - storageH}
                      width={barW}
                      height={storageH}
                      fill={STORAGE_COLOR}
                      rx={3}
                      opacity={item.storage === 0 ? 0.15 : 1}
                      style={{
                        transformOrigin: `${storageX + barW / 2}px ${baseY}px`,
                        animation: `bmBarGrow_${animKey} 0.5s cubic-bezier(.4,0,.2,1) ${idx * 0.04 + 0.02}s both`,
                        transition: "opacity .15s",
                      }}
                      onMouseEnter={(e) =>
                        handleBarEnter(e, cx + gap / 2 + barW / 2, baseY - storageH - 4, item.storage, labels[idx], "Storage")
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                style={{
                  position: "absolute",
                  left: tooltip.x,
                  top: tooltip.y,
                  transform: tooltip.flipped
                    ? "translate(-50%, 16px)"
                    : "translate(-50%, calc(-100% - 12px))",
                  background: "white",
                  border: "1px solid var(--color-border-secondary)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  minWidth: 90,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: tooltip.type === "Moving" ? "#185fa5" : "#0f6e56", marginBottom: 3 }}>
                  {tooltip.value.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    borderTop: "0.5px solid var(--color-border-tertiary)",
                    paddingTop: 4,
                    marginTop: 1,
                  }}
                >
                  {tooltip.label} · {tooltip.type}
                </div>
              </div>
            )}

            {/* X Labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 6,
                fontSize: 11,
                color: "var(--color-text-secondary)",
              }}
            >
              {visibleLabels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingMixGraph;