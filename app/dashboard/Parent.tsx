import React, { useEffect, useState } from "react";
import UserGrowthGraph from "./UserGrowthGraph";
import BookingMixGraph from "./BookingMixGraph";
import DashboardStats from "./DashboardStats";
import { dashboardAPI } from "../api/dashboard";
import type { UserGraphRange, UserGraphPoint, BookingGraphPoint, DashboardStatsData } from "../api/dashboard/types";

const Parent = () => {
  // Stats
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  // User Growth
  const [trendData, setTrendData] = useState<UserGraphPoint[]>([]);
  const [userGraphLoading, setUserGraphLoading] = useState<boolean>(true);
  const [userGraphRange, setUserGraphRange] = useState<UserGraphRange>("yearly");
  // Booking Mix
  const [bookingMixData, setBookingMixData] = useState<BookingGraphPoint[]>([]);
  const [bookingMixLoading, setBookingMixLoading] = useState<boolean>(true);
  const [bookingMixGraphRange, setBookingMixGraphRange] = useState<UserGraphRange>("yearly");

  // Fetch stats once on mount
  useEffect(() => {
    setStatsLoading(true);
    dashboardAPI.getStats()
      .then((res) => setStats(res.data ?? null))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch user growth graph when filter changes
  useEffect(() => {
    setUserGraphLoading(true);
    dashboardAPI.getUsersGraph(userGraphRange)
      .then((res) => setTrendData(res.data ?? []))
      .catch(() => setTrendData([]))
      .finally(() => setUserGraphLoading(false));
  }, [userGraphRange]);

  // Fetch booking mix graph when filter changes
  useEffect(() => {
    setBookingMixLoading(true);
    dashboardAPI.getBookingsGraph(bookingMixGraphRange)
      .then((res) => setBookingMixData(res.data ?? []))
      .catch(() => setBookingMixData([]))
      .finally(() => setBookingMixLoading(false));
  }, [bookingMixGraphRange]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardStats stats={stats} loading={statsLoading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserGrowthGraph
          data={trendData}
          loading={userGraphLoading}
          range={userGraphRange}
          onRangeChange={setUserGraphRange}
        />
        <BookingMixGraph
          data={bookingMixData}
          loading={bookingMixLoading}
          range={bookingMixGraphRange}
          onRangeChange={setBookingMixGraphRange}
        />
      </div>
    </div>
  );
};

export default Parent;
