import React, { useMemo, useRef, useState, useEffect } from "react";
import type { UserGraphRange, UserGraphPoint } from "../api/dashboard/types";

const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type TooltipState = {
  x: number;
  y: number;
  flipped: boolean;
  value: number;
  label: string;
  visible: boolean;
};

interface UserGrowthGraphProps {
  data: UserGraphPoint[];
  loading: boolean;
  range: UserGraphRange;
  onRangeChange: (range: UserGraphRange) => void;
}

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


const graphFilters: UserGraphRange[] = ["weekly", "monthly", "yearly"];
const VB_W = 560;
const VB_H = 180;
const PAD_T = 20;
const PAD_B = 15;

const UserGrowthGraph: React.FC<UserGrowthGraphProps> = ({
  data,
  loading,
  range,
  onRangeChange,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<SVGPolylineElement | null>(null);

  const counts = useMemo(
    () =>
      Array.isArray(data) && data.length > 0
        ? data.map((d) => Number(d.count ?? d))
        : [0, 0, 0, 0, 0, 0, 0],
    [data]
  );

  const labels = useMemo(
    () =>
      Array.isArray(data) && data.length > 0
        ? data.map((d) => formatPeriodLabel(d.period))
        : defaultLabels,
    [data]
  );

  const peak = Math.max(...counts, 1);

  const graphPoints = useMemo(() => {
    const n = counts.length;
    return counts.map((v, i) => {
      const x = n === 1 ? VB_W / 2 : (i / (n - 1)) * VB_W;
      const y = PAD_T + (1 - v / peak) * (VB_H - PAD_T - PAD_B);
      return { x, y, v };
    });
  }, [counts, peak]);

  const linePts = graphPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPts = `${graphPoints[0]?.x ?? 0},${VB_H} ${linePts} ${
    graphPoints[graphPoints.length - 1]?.x ?? VB_W
  },${VB_H}`;

  const visibleLabels = useMemo(() => {
    if (labels.length <= 8) return labels;
    // Always include first and last, distribute the rest evenly
    const step = (labels.length - 1) / 6;
    const indices = new Set(
      Array.from({ length: 7 }, (_, i) => Math.round(i * step))
    );
    return labels.map((l, i) => (indices.has(i) ? l : ""));
  }, [labels]);

  // Trigger animation only on range change, not on data updates
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [range]);

  // Compute animated line length after render
  const [lineLen, setLineLen] = useState(800);
  useEffect(() => {
    if (lineRef.current) {
      setLineLen(lineRef.current.getTotalLength?.() ?? 800);
    }
  }, [linePts]);

  const TOOLTIP_H = 62; // approx tooltip height in px

  const handleDotEnter = (
    e: React.MouseEvent,
    point: { x: number; y: number; v: number },
    idx: number
  ) => {
    if (!svgRef.current || !wrapRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / VB_W;
    const scaleY = svgRect.height / VB_H;
    const px = point.x * scaleX + (svgRect.left - wrapRect.left);
    const py = point.y * scaleY + (svgRect.top - wrapRect.top);
    setTooltip({
      x: px,
      y: py,
      // flip below if not enough space above
      flipped: py < TOOLTIP_H + 8,
      value: point.v,
      label: labels[idx] ?? "",
      visible: true,
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
          <p
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            User Growth
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              margin: "2px 0 0",
            }}
          >
            Track signups over time
          </p>
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

      {/* Chart */}
      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ width: "100%", height: 200, overflow: "visible" }}
          preserveAspectRatio="none"
          role="img"
          aria-label="User growth line chart"
        >
          <defs>
            <linearGradient id="ugAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#378add" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#378add" stopOpacity="0" />
            </linearGradient>
            <style>{`
              @keyframes ugDrawLine {
                from { stroke-dashoffset: ${lineLen}; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes ugFadeArea {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes ugDotPop {
                0% { r: 0; opacity: 0; }
                70% { r: 5; }
                100% { r: 4; opacity: 1; }
              }
            `}</style>
          </defs>

          {/* Grid lines */}
          {[30, 75, 120, 165].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={VB_W}
              y2={y}
              stroke="var(--color-border-tertiary)"
              strokeWidth="0.5"
            />
          ))}

          {/* Area */}
          <polygon
            key={`area-${animKey}`}
            points={areaPts}
            fill="url(#ugAreaGrad)"
            style={{
              animation: `ugFadeArea 0.5s ease ${animKey > 0 ? "0.7s" : "0s"} both`,
            }}
          />

          {/* Line */}
          <polyline
            key={`line-${animKey}`}
            ref={lineRef}
            points={linePts}
            fill="none"
            stroke="#378add"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: lineLen,
              animation: `ugDrawLine 0.9s cubic-bezier(.4,0,.2,1) forwards`,
            }}
          />

          {/* Dots */}
          {graphPoints.map((point, i) => (
            <g
              key={`dot-${i}-${animKey}`}
              onMouseEnter={(e) => handleDotEnter(e, point, i)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Hit area */}
              <circle cx={point.x} cy={point.y} r="16" fill="transparent" />
              {/* Visible dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="var(--color-background-primary)"
                stroke="#378add"
                strokeWidth="2"
                style={{
                  animation: `ugDotPop .3s ease ${0.7 + i * 0.06}s both`,
                  transition: "r .1s ease",
                }}
              />
            </g>
          ))}

          {loading && (
            <text
              x={VB_W / 2}
              y="20"
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-secondary)"
            >
              Loading...
            </text>
          )}
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
              opacity: tooltip.visible ? 1 : 0,
              transition: "opacity .12s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              minWidth: 90,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#185fa5",
                marginBottom: 3,
              }}
            >
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
              {tooltip.label}
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
      </div>
    </div>
  );
};

export default UserGrowthGraph;