import { apiClient } from "../client";
import { Booking } from "../../../app/booking/types";

export const bookingAPI = {
  async list(): Promise<Booking[]> {
    const res = await apiClient.get<{ data: Booking[] }>("/booking/admin");
    return res.data as any || [];
  },
  async detail(id: string): Promise<Booking | null> {
    const res = await apiClient.get<{ data: Booking }>(`/booking/${id}`);
    return res.data as any || null;
  },
  async remove(id: string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean }>(`/booking/${id}`);
    return !!res.success;
  },
};
