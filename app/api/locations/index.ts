import { apiClient } from "../client";
import { ServiceLocationsResponse } from "./types";

export const locationsAPI = {
    getLocations: async (search?: string) => {
        const queryParams = new URLSearchParams();
        if (search && search.trim()) {
            queryParams.append('search', search.trim());
        }
        
        const url = `/service-locations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get<ServiceLocationsResponse>(url);
        return response;
    },

    updateLocations: async (id: any, payload: any) => {
        const response = await apiClient.put<any>(`/service-locations/${id}`, payload);
        return response;
    },

    createLocations: async (payload: any) => {
        const response = await apiClient.post<any>(`/service-locations`, payload);
        return response;
    },
    
    getLocationDetail: async (id: string) => {
        const response = await apiClient.get<ServiceLocationsResponse>(`/service-locations/${id}`);
        return response;
    },

    deleteLocation: async (id: string) => {
        const response = await apiClient.delete<any>(`/service-locations/${id}`);
        return response;
    },
}