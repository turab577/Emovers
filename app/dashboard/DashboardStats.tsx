import React from "react";
import type { DashboardStatsData } from "../api/dashboard/types";

interface DashboardStatsProps {
  stats: DashboardStatsData | null;
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
        <p className="body-5 text-[#70747D]">Users count</p>
        <h2 className="heading-3 text-[#111827] mt-2">{loading ? "-" : stats?.usersCount ?? 0}</h2>
      </div>
      <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
        <p className="body-5 text-[#70747D]">Total bookings</p>
        <h2 className="heading-3 text-[#111827] mt-2">{loading ? "-" : stats?.totalBookings ?? 0}</h2>
      </div>
      <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
        <p className="body-5 text-[#70747D]">Storage bookings</p>
        <h2 className="heading-3 text-[#111827] mt-2">{loading ? "-" : stats?.storageBookings ?? 0}</h2>
      </div>
      <div className="rounded-xl bg-[#F4F4F4] p-4 border border-[#11182714]">
        <p className="body-5 text-[#70747D]">Moving bookings</p>
        <h2 className="heading-3 text-[#111827] mt-2">{loading ? "-" : stats?.movingBookings ?? 0}</h2>
      </div>
    </section>
  );
};

export default DashboardStats;
