import { apiClient } from "../client";
import { UsersApiResponse } from "./types";

interface GetUsersParams {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  emailVerified?: string;
  search?: string;
}

export const userAPI = {
  getUsers: async (params?: GetUsersParams) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params - always send limit=2
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    // Or force limit=2:
    // queryParams.append('limit', '2');
    
    // Add filter params (uppercase as required)
    if (params?.status && params.status !== "All Statuses") {
      queryParams.append('status', params.status.toUpperCase());
    }
    if (params?.role && params.role !== "All Roles") {
      queryParams.append('role', params.role.toUpperCase());
    }
    if (params?.emailVerified && params.emailVerified !== "All") {
      queryParams.append('emailVerified', params.emailVerified === "Verified" ? "true" : "false");
    }
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/admin/user-management/users${queryString ? `?${queryString}` : ''}`;
    
    console.log('Users API: Fetching from URL:', url);
    const response = await apiClient.get<UsersApiResponse>(url);
    console.log('Users API: Received response:', response);
    return response;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<any>(`/admin/user-management/users/${id}`);
    return response;
  },

  getUserDetail: async (id:any) => {
        const response = await apiClient.get<any>(`/admin/user-management/users/${id}`);
        return response; // Return the data, not the whole response
    },

  updateUserDetail: async (id:any , payload : any) => {
        const response = await apiClient.put<any>(`/admin/user-management/users/${id}` , payload);
        return response; // Return the data, not the whole response
    },
     getStats: async () => {
        const response = await apiClient.get<any>(`/admin/user-management/statistics`);
        return response; // Return the data, not the whole response
    },

     getAdmins: async (params?: GetUsersParams) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params - always send limit=2
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    // Or force limit=2:
    // queryParams.append('limit', '2');
    
    // Add filter params (uppercase as required)
    if (params?.status && params.status !== "All Statuses") {
      queryParams.append('status', params.status.toUpperCase());
    }
    if (params?.role && params.role !== "All Roles") {
      queryParams.append('role', params.role.toUpperCase());
    }
    if (params?.emailVerified && params.emailVerified !== "All") {
      queryParams.append('emailVerified', params.emailVerified === "Verified" ? "true" : "false");
    }
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/admin/user-management/admins${queryString ? `?${queryString}` : ''}`;
    
    console.log('Users API: Fetching from URL:', url);
    const response = await apiClient.get<UsersApiResponse>(url);
    console.log('Users API: Received response:', response);
    return response;
  },

  addAdmins: async (payload: any) => {
      try {
        const response = await apiClient.post<any>(`/admin/user-management/admins`, payload);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
};