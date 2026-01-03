import { apiClient } from "../client";

export const profileAPI = {
    getProfile: async () => {
        const response = await apiClient.get<any>(`/profile`);
        console.log('Profile API: Received response:', response);
        return response; // Return the data, not the whole response
    },

    updateProfileApiResponse: async (payload : any) => {
        const response = await apiClient.put<any>(`/profile`, payload);
        console.log('Profile API: Received response:', response);
        return response; // Return the data, not the whole response
    },
    
    updateProfileImage: async (payload : any) => {
        const response = await apiClient.post<any>(`/profile/picture`, payload);
        console.log('Profile API: Received response:', response);
        return response; // Return the data, not the whole response
    },      
}