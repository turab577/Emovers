// authApi.ts
import { apiClient } from "../client";
import {
  LoginRequest,
  LoginSuccessResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./types";

export const authApi = {
  // Add async/await to ensure the request happens
  login: async (payload: LoginRequest) => {
    console.log('Auth API: Sending login request with payload:', payload);
    const response = await apiClient.post<LoginSuccessResponse>(`/auth/login`, payload);
    console.log('Auth API: Received response:', response);
    return response;
  },

  refreshToken: async (payload: RefreshTokenRequest) => {
    console.log('Auth API: Sending refresh token request');
    const response = await apiClient.post<RefreshTokenResponse>(`/auth/refresh`, payload);
    return response;
  },
};