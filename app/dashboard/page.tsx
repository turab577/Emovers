"use client";

import { useEffect, useMemo, useState } from "react";
import { dashboardAPI } from "../api/dashboard";
import { DashboardStatsData, UserGraphRange } from "../api/dashboard/types";

const fallbackStats: DashboardStatsData = {
  usersCount: 0,
  totalBookings: 0,
  storageBookings: 0,
  movingBookings: 0,
};

const dummyTrend = [42, 56, 48, 65, 70, 66, 84];
const dummyDistribution = [46, 32, 22];
const graphFilters: UserGraphRange[] = ["weekly", "monthly", "yearly"];

const formatPeriodLabel = (period: string, range: UserGraphRange) => {
  if (!period) return "-";

  if (range === "weekly") {
    const [year, month, day] = period.split("-");
    if (!year || !month || !day) return period;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (range === "yearly") {
    const [year, month] = period.split("-");
    if (!year || !month) return period;
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  }

  if (range === "monthly") {
    const [year, month, day] = period.split("-");
    if (!year || !month || !day) return period;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return period;
};

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStatsData>(fallbackStats);
  const [trendData, setTrendData] = useState<number[]>(dummyTrend);
  const [trendLabels, setTrendLabels] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [selectedGraphRange, setSelectedGraphRange] = useState<UserGraphRange>("yearly");
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [distribution, setDistribution] = useState<number[]>(dummyDistribution);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await dashboardAPI.getStats();
        const nextStats = {
          usersCount: Number(response?.data?.usersCount ?? 0),
          totalBookings: Number(response?.data?.totalBookings ?? 0),
          storageBookings: Number(response?.data?.storageBookings ?? 0),
          movingBookings: Number(response?.data?.movingBookings ?? 0),
        };

        setStats(nextStats);

        const otherBookings = Math.max(
          0,
          nextStats.totalBookings - nextStats.storageBookings - nextStats.movingBookings
        );
        const total = Math.max(
          1,
          nextStats.storageBookings + nextStats.movingBookings + otherBookings
        );

        setDistribution([
          Math.round((nextStats.movingBookings / total) * 100),
          Math.round((nextStats.storageBookings / total) * 100),
          Math.round((otherBookings / total) * 100),
        ]);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadUsersGraph = async () => {
      setIsGraphLoading(true);

      try {
        const response = await dashboardAPI.getUsersGraph(selectedGraphRange);
        const points = Array.isArray(response?.data) ? response.data : [];

        if (!points.length) {
          setTrendData(dummyTrend);
          setTrendLabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
          return;
        }

        setTrendData(points.map((item) => Number(item.count ?? 0)));
        setTrendLabels(
          points.map((item) => formatPeriodLabel(item.period, selectedGraphRange))
        );
      } catch (error) {
        console.error("Failed to fetch users graph:", error);
        setTrendData(dummyTrend);
        setTrendLabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
      } finally {
        setIsGraphLoading(false);
      }
    };

    loadUsersGraph();
  }, [selectedGraphRange]);

  const graphPoints = useMemo(() => {
    const count = trendData.length;
    const maxValue = Math.max(...trendData, 1);

    return trendData.map((value, index) => {
      const x = count === 1 ? 210 : 24 + (index * 372) / (count - 1);
      const y = 210 - (value / maxValue) * 150;
      return { x, y, value };
    });
  }, [trendData]);

  const linePoints = useMemo(() => {
    return graphPoints.map((point) => `${point.x},${point.y}`).join(" ");
  }, [graphPoints]);

  const visibleTrendLabels = useMemo(() => {
    if (trendLabels.length <= 8) return trendLabels;
    return trendLabels.map((label, index) => (index % 2 === 0 ? label : ""));
  }, [trendLabels]);

  const areaPoints = useMemo(() => `${linePoints} 396,220 24,220`, [linePoints]);
  const donutStyle = {
    background: `conic-gradient(#06B6D4 0 ${distribution[0]}%, #22C55E ${distribution[0]}% ${distribution[0] + distribution[1]}%, #F59E0B ${distribution[0] + distribution[1]}% 100%)`,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-[#111827]">Dashboard</h1>
        <p className="heading-5 text-[#70747D]">Live stats from dashboard API</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
          <p className="body-5 text-[#70747D]">Users count</p>
          <h2 className="heading-3 text-[#111827] mt-2">{stats.usersCount}</h2>
        </div>
        <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
          <p className="body-5 text-[#70747D]">Total bookings</p>
          <h2 className="heading-3 text-[#111827] mt-2">{stats.totalBookings}</h2>
        </div>
        <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
          <p className="body-5 text-[#70747D]">Storage bookings</p>
          <h2 className="heading-3 text-[#111827] mt-2">{stats.storageBookings}</h2>
        </div>
        <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
          <p className="body-5 text-[#70747D]">Moving bookings</p>
          <h2 className="heading-3 text-[#111827] mt-2">{stats.movingBookings}</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-[#F8FBFF] via-[#F0F7FF] to-[#EBF4FF] border border-[#CFE1FF] p-4 shadow-[0_14px_32px_rgba(9,47,109,0.12)]">
          <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="heading-4 text-[#0A1F44]">User Growth Graph</h3>
              <span className="body-5 text-[#4D6389]">Track user data over time</span>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white border border-[#D2E2FF] w-fit shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]">
              {graphFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedGraphRange(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                    selectedGraphRange === filter
                      ? "bg-[#0B5FFF] text-white shadow-[0_6px_12px_rgba(11,95,255,0.3)]"
                      : "text-[#36507B] hover:bg-[#EEF5FF]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 420 230" className="w-full h-[260px]">
            <defs>
              <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="trendStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <line x1="24" y1="220" x2="396" y2="220" stroke="#D9E7FF" strokeWidth="1" />
            <line x1="24" y1="170" x2="396" y2="170" stroke="#EAF2FF" strokeDasharray="5 6" strokeWidth="1" />
            <line x1="24" y1="120" x2="396" y2="120" stroke="#EAF2FF" strokeDasharray="5 6" strokeWidth="1" />
            <line x1="24" y1="70" x2="396" y2="70" stroke="#EAF2FF" strokeDasharray="5 6" strokeWidth="1" />
            <polygon points={areaPoints} fill="url(#trendFill)" />
            <polyline
              points={linePoints}
              fill="none"
              stroke="url(#trendStroke)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {graphPoints.map((point, index) => (
              <g key={`${point.x}-${index}`}>
                <circle cx={point.x} cy={point.y} r="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
                <circle cx={point.x} cy={point.y} r="2" fill="#0284C7" />
              </g>
            ))}

            {visibleTrendLabels.map((label, index) => {
              const x = trendData.length === 1 ? 210 : 24 + (index * 372) / Math.max(trendData.length - 1, 1);
              return (
                <text
                  key={`${label}-${index}`}
                  x={x}
                  y="226"
                  textAnchor="middle"
                  className="fill-[#64748B]"
                  style={{ fontSize: "11px", fontWeight: 500 }}
                >
                  {label}
                </text>
              );
            })}

            {isGraphLoading && (
              <text
                x="210"
                y="30"
                textAnchor="middle"
                className="fill-[#0284C7]"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Loading user graph...
              </text>
            )}
          </svg>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[#FFFDF8] via-[#FFFAF0] to-[#FFF7E3] border border-[#F6E8C8] p-4 shadow-[0_12px_30px_rgba(161,98,7,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="heading-4 text-[#4A2D00]">Booking Mix Graph</h3>
            <span className="body-5 text-[#8A6B2A]">Distribution</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 h-[260px]">
            <div className="relative h-44 w-44 rounded-full" style={donutStyle}>
              <div className="absolute inset-7 rounded-full bg-[#FFFDF9] border border-[#F4E6C6] flex flex-col items-center justify-center">
                <span className="heading-4 text-[#6C4A0A]">{stats.totalBookings}</span>
                <span className="text-[11px] font-medium text-[#AA7A1E]">Total</span>
              </div>
            </div>

            <div className="space-y-3 w-full max-w-[240px]">
              <div className="flex items-center justify-between rounded-lg bg-[#EEFBFF] p-3 border border-[#C8EEF7]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#06B6D4]" />
                  <span className="body-5 text-[#12344A]">Moving</span>
                </div>
                <span className="body-5 text-[#12344A]">{distribution[0]}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#F1FFF3] p-3 border border-[#D8F7DE]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
                  <span className="body-5 text-[#1A4C2E]">Storage</span>
                </div>
                <span className="body-5 text-[#1A4C2E]">{distribution[1]}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#FFF8EA] p-3 border border-[#F8E3BA]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                  <span className="body-5 text-[#5C3B04]">Other</span>
                </div>
                <span className="body-5 text-[#5C3B04]">{distribution[2]}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
