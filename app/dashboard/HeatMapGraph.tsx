"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";

const LeadsGenerationGraph = () => {
  const [activeView, setActiveView] = useState("Yearly");
  const [graphWidth, setGraphWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    value: number;
    month: string;
    col: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    value: 0,
    month: "",
    col: 0,
  });

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const views = ["Today", "Weekly", "Monthly", "Yearly"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Data sets for different time views
  const dataSets = {
    Today: 3200,
    Weekly: 5800,
    Monthly: 7500,
    Yearly: 9200,
  };

  const rows = 19;
  const desiredCols = 46;
  const dotWidth = 10;
  const dotHeight = 6;
  const horizontalGap = 2;
  const verticalSpacing = 2;

  // Calculate columns based on graph width
  const cols = graphWidth
    ? Math.min(
        desiredCols,
        Math.floor((graphWidth - horizontalGap) / (dotWidth + horizontalGap))
      )
    : desiredCols;

  const svgWidth = graphWidth;
  const svgHeight = rows * (dotHeight + verticalSpacing);
  const totalHorizontalSpace = svgWidth - cols * dotWidth;
  const gapX = cols > 1 ? totalHorizontalSpace / (cols - 1) : 0;

  // Generate deterministic intensity values based on row and col
  const generateDeterministicIntensity = (row: number, col: number) => {
    // Use a simple deterministic algorithm based on row and col
    const seed = (row * 7919 + col * 65537) % 1000; // Prime numbers for better distribution
    return 0.1 + (seed % 10) * 0.01; // 0.1 - 0.19 range
  };

  // Generate data points for each column
  const generateColumnData = () => {
    const currentDataSet = dataSets[activeView as keyof typeof dataSets];
    const dataPoints = [];

    for (let col = 0; col < cols; col++) {
      const normalizedCol = col / Math.max(cols - 1, 1);
      let value = 0;

      switch (activeView) {
        case "Today":
          value = Math.floor(
            (Math.sin(normalizedCol * Math.PI * 3) * 0.4 +
              Math.sin(normalizedCol * Math.PI * 6) * 0.3 +
              0.3) *
              currentDataSet
          );
          break;
        case "Weekly":
          const weeklyPattern = Math.sin(normalizedCol * Math.PI * 1.2);
          const weekendDip = Math.sin(normalizedCol * Math.PI * 7) * 0.2;
          value = Math.floor(
            Math.max(0, weeklyPattern * 0.8 - weekendDip) * currentDataSet
          );
          break;
        case "Monthly":
          value = Math.floor(
            (Math.sin(normalizedCol * Math.PI * 0.9) * 0.9 + 0.1) *
              currentDataSet
          );
          break;
        case "Yearly":
          const baseMountain = Math.sin(normalizedCol * Math.PI);
          const seasonalVariation = Math.sin(normalizedCol * Math.PI * 4) * 0.2;
          value = Math.floor(
            Math.max(0, baseMountain * 0.8 + seasonalVariation) * currentDataSet
          );
          break;
        default:
          value = Math.floor(
            Math.sin(normalizedCol * Math.PI) * currentDataSet
          );
      }

      // Map to month for display - FIXED: Ensure proper month mapping
      const monthIndex = Math.min(Math.floor((col / cols) * 12), 11);
      const month = months[monthIndex];

      dataPoints.push({
        col,
        value: Math.max(0, value),
        month,
      });
    }
    return dataPoints;
  };

  // Generate dot data using useMemo to prevent unnecessary recalculations
  const dotData = useMemo(() => {
    const data = [];
    const currentDataSet = dataSets[activeView as keyof typeof dataSets];
    const columnData = generateColumnData();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const normalizedCol = col / Math.max(cols - 1, 1);
        let mountainHeight = 0;

        switch (activeView) {
          case "Today":
            mountainHeight =
              Math.sin(normalizedCol * Math.PI * 3) * 0.4 +
              Math.sin(normalizedCol * Math.PI * 6) * 0.3 +
              0.3;
            break;
          case "Weekly":
            const weeklyPattern = Math.sin(normalizedCol * Math.PI * 1.2);
            const weekendDip = Math.sin(normalizedCol * Math.PI * 7) * 0.2;
            mountainHeight = Math.max(0, weeklyPattern * 0.8 - weekendDip);
            break;
          case "Monthly":
            mountainHeight =
              Math.sin(normalizedCol * Math.PI * 0.9) * 0.9 + 0.1;
            break;
          case "Yearly":
            const baseMountain = Math.sin(normalizedCol * Math.PI);
            const seasonalVariation =
              Math.sin(normalizedCol * Math.PI * 4) * 0.2;
            mountainHeight = Math.max(
              0,
              baseMountain * 0.8 + seasonalVariation
            );
            break;
          default:
            mountainHeight = Math.sin(normalizedCol * Math.PI);
        }

        const scaleFactor = currentDataSet / 10000;
        mountainHeight = Math.min(1, mountainHeight * scaleFactor * 1.5);
        const dataThreshold = Math.floor(mountainHeight * rows);

        const isDataDot = row >= rows - dataThreshold - 1 && row < rows;

        let intensity;
        if (isDataDot) {
          const positionInMountain = (rows - row) / Math.max(dataThreshold, 1);
          intensity = 0.6 + positionInMountain * 0.4;
        } else {
          // Use deterministic intensity instead of Math.random()
          intensity = generateDeterministicIntensity(row, col);
        }

        data.push({
          row,
          col,
          intensity,
          isDataDot,
          month: columnData[col]?.month || months[11],
          value: columnData[col]?.value || 0,
        });
      }
    }
    return data;
  }, [activeView, cols, graphWidth]);

  // Dynamic Y-axis labels
 // Fixed Y-axis labels function with proper TypeScript typing
const getYAxisLabels = (): string[] => {
  const maxValue = dataSets[activeView as keyof typeof dataSets];
  
  // For Today view, ensure unique labels without duplicates
  if (activeView === "Today") {
    const labels: string[] = [];
    const step = maxValue / 5; // Divide into 5 equal parts
    
    for (let i = 5; i >= 0; i--) {
      const value = Math.round((i * step) / 100) * 100; // Round to nearest 100
      const label = value >= 1000 ? `${value / 1000}k` : `${value}`;
      
      // Only add label if it's different from the previous one
      if (labels.length === 0 || label !== labels[labels.length - 1]) {
        labels.push(label);
      }
    }
    
    // Ensure we have at least 3 labels
    while (labels.length < 3) {
      const extraValue = Math.round((labels.length * step) / 100) * 100;
      const extraLabel = extraValue >= 1000 ? `${extraValue / 1000}k` : `${extraValue}`;
      if (!labels.includes(extraLabel)) {
        labels.splice(1, 0, extraLabel);
      }
    }
    
    return labels;
  }
  
  // Original logic for other views
  return [
    `${Math.round(maxValue / 1000)}k`,
    `${Math.round((maxValue * 0.8) / 1000)}k`,
    `${Math.round((maxValue * 0.6) / 1000)}k`,
    `${Math.round((maxValue * 0.4) / 1000)}k`,
    `${Math.round((maxValue * 0.2) / 1000)}k`,
    "0",
  ];
};

  const yAxisLabels = getYAxisLabels();

  // Handle view change
  const handleViewChange = (view: string) => {
    setActiveView(view);
    setTooltip({ ...tooltip, visible: false });
  };

  // Handle mouse move over graph - COMPLETELY FIXED
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !graphContainerRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = graphContainerRef.current.getBoundingClientRect();

    const mouseX = e.clientX - svgRect.left;
    const colWidth = svgWidth / cols;
    const colIndex = Math.min(Math.floor(mouseX / colWidth), cols - 1);

    // Find the specific dot being hovered
    const mouseY = e.clientY - svgRect.top;
    const rowHeight = dotHeight + verticalSpacing;
    const rowIndex = Math.floor(mouseY / rowHeight);

    // Check if this specific position has a data dot
    const hoveredDot = dotData.find(
      (dot) => dot.col === colIndex && dot.row === rowIndex && dot.isDataDot
    );

    if (hoveredDot) {
      const tooltipX = e.clientX - containerRect.left;
      const tooltipY = e.clientY - containerRect.top - 60;

      setTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        value: hoveredDot.value,
        month: hoveredDot.month,
        col: colIndex,
      });
    } else {
      setTooltip({ ...tooltip, visible: false });
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  useEffect(() => {
    const updateWidth = () => {
      if (graphContainerRef.current) {
        setGraphWidth(graphContainerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Get color and opacity based on dot type
  const getDotStyle = (intensity: number, isDataDot: boolean) => {
    if (isDataDot) {
      return { fill: "#5666F17A" };
    } else {
      return { fill: "#5666F1", opacity: 0.8 * intensity };
    }
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto h-[275px]"
      style={{
        borderRadius: 8,
        border: "1px solid rgba(17, 24, 39, 0.04)",
        background: "#FFF",
        padding: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="body-1 font-medium text-[#111827]">Leads generation</h2>
        <div className="flex gap-2">
          {views.map((view) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`flex items-end gap-2 rounded-[100px] px-3 py-1.5 text-[12px] font-normal transition-colors ${
                activeView === view
                  ? "bg-[#F0F0F0] text-[#11224E]"
                  : "text-[#A0A3A9] hover:text-gray-600"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="relative flex-1">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-sm text-gray-400 pr-4">
          {yAxisLabels.map((label, index) => (
            <div key={index}>{label}</div>
          ))}
        </div>

        {/* Dot Heatmap */}
        <div className="ml-10 w-full h-full flex flex-col">
          <div
            className="flex-1 relative overflow-visible"
            ref={graphContainerRef}
          >
            {graphWidth > 0 && (
              <svg
                ref={svgRef}
                width="93%"
                height="100%"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="xMidYMid meet"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "default" }}
              >
                {dotData.map((dot, idx) => {
                  const centerX = dot.col * (dotWidth + gapX) + dotWidth / 2;
                  const centerY =
                    dot.row * (dotHeight + verticalSpacing) + dotHeight / 2;
                  const dotStyle = getDotStyle(dot.intensity, dot.isDataDot);

                  return (
                    <ellipse
                      key={idx}
                      cx={centerX}
                      cy={centerY}
                      rx={dotWidth / 2}
                      ry={dotHeight / 2}
                      fill={dotStyle.fill}
                      opacity={dotStyle.opacity}
                      style={{ transition: "none" }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Tooltip */}
            {tooltip.visible && (
              <div
                ref={tooltipRef}
                className="absolute z-10 px-4 py-3 text-sm text-white bg-[#11224E] rounded-lg shadow-xl min-w-40 border border-gray-700 pointer-events-none"
                style={{
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="flex justify-between items-center gap-4">
                  <span className="font-semibold text-gray-100">
                    {tooltip.month}
                  </span>
                  <span className="text-gray-300">
                    {tooltip.value.toLocaleString()} leads
                  </span>
                </div>
                <div
                  className="absolute top-full left-1/2 w-3 h-3 bg-[#11224E] transform -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-gray-700"
                  style={{ marginTop: "-1px" }}
                ></div>
              </div>
            )}
          </div>

          {/* X-axis */}
          <div className="flex mt-2 text-sm text-[#414652] font-normal overflow-visible">
            {months.map((month) => (
              <div
                key={month}
                className="flex-1 text-center whitespace-nowrap text-xs sm:text-sm -ml-10"
              >
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsGenerationGraph;
