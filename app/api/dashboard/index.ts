import { apiClient } from "../client";
import { BookingGraphPoint, DashboardStatsData, UserGraphPoint, UserGraphRange } from "./types";

export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get<DashboardStatsData>("/dashboard/stats");
    return response;
  },

  getUsersGraph: async (range: UserGraphRange = "yearly") => {
    const response = await apiClient.get<UserGraphPoint[]>(`/dashboard/users-graph?range=${range}`);
    return response;
  },

  getBookingsGraph: async (range: UserGraphRange = "yearly") => {
    const response = await apiClient.get<BookingGraphPoint[]>(`/dashboard/bookings-graph?range=${range}`);
    return response;
  },
};
