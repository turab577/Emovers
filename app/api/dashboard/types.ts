export interface DashboardStatsData {
  usersCount: number;
  totalBookings: number;
  storageBookings: number;
  movingBookings: number;
}

export interface UserGraphPoint {
  period: string;
  count: number;
}

export interface BookingGraphPoint {
  period: string;
  moving: number;
  storage: number;
}

export type UserGraphRange = "yearly" | "monthly" | "weekly";

