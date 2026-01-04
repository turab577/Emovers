import { apiClient } from "../client";

export const servicesApi = {
  // GET services with optional type and search filters
  getServices: async (filters?: { 
    type?: 'MOVING' | 'STORAGE' | string; 
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Add type parameter if provided
    if (filters?.type && filters.type !== "All") {
      queryParams.append('type', filters.type);
    }
    
    // Add search parameter if provided
    if (filters?.search) {
      queryParams.append('search', filters.search.trim());
    }
    
    const url = `/movingservice${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching services from URL:', url);
    
    const response = await apiClient.get(url);
    console.log('Services API response:', response);
    return response;
  },

  // POST create new service (multipart form)
  createService: async (payload: FormData) => {
    const response = await apiClient.post(`/movingservice`, payload);
    return response;
  },

  // PUT update service by ID (multipart form)
  updateService: async (id: string, payload: FormData) => {
    const response = await apiClient.put(`/movingservice/${id}`, payload);
    return response;
  },

  // DELETE service by ID
  deleteService: async (id: string) => {
    const response = await apiClient.delete(`/movingservice/${id}`);
    return response;
  },
};