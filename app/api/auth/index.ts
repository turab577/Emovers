// authApi.ts
import { apiClient } from "../client";
import {
  LoginRequest,
  LoginSuccessResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./types";

export const authApi = {
  login: async (payload: LoginRequest) => {
    try {
      const response = await apiClient.post<LoginSuccessResponse>(`/auth/login`, payload);
      return response;
    } catch (error: any) {
      // The error from apiClient should have the structure: { message, error, statusCode }
      // Re-throw it so it can be caught in the Login component
      throw error;
    }
  },

  refreshToken: async (payload: RefreshTokenRequest) => {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(`/auth/refresh`, payload);
      return response;
    } catch (error: any) {
      throw error;
    }
  },
};