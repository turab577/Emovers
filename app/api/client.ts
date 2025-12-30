// import Cookies from "js-cookie";
import { tokenService } from "../utils/TokenService";

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  status?: number;
  error?: any;
  events?: any;
  meta?: any;
  data?: T;
  pagination?: any;
  request_id?: string;
  statistics?: any;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  getToken?: () => string | null;
}

export interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
}

let apiConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://backend.appointme.vordx.com/api/v1",
  timeout: 20000,
  getToken: () => tokenService.getAccessToken() ?? null,
};

const DEFAULT_CONFIG = { ...apiConfig };

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions
): Promise<ApiResponse<T>> {
  const url = `${apiConfig.baseURL}${endpoint}`;

  // Detect FormData so we can send it as-is and allow the browser to set the Content-Type with boundary
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  // If caller accidentally set Content-Type for FormData, remove it so browser can set boundary
  if (isFormData && headers["Content-Type"]) {
    delete headers["Content-Type"];
  }

  const token = apiConfig.getToken?.();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, {
      method: options.method,
      headers,
      // Send FormData as-is; otherwise stringify JSON bodies
      body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
      cache: options.cache || "no-store",
    });

    const responseData = await response.json().catch(() => ({}));

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      console.warn('Received 401 Unauthorized');

      // For billing endpoints, don't auto-redirect - let the component handle it
      if (endpoint.includes('/billing/')) {
        return {
          success: false,
          message: responseData.message || 'Authentication required',
          status: response.status,
          error: responseData.error || 'Unauthorized',
          data: undefined,
        };
      }

      // Try to refresh token before giving up
      try {
        const newToken = await tokenService.refreshAccessToken();
        if (newToken) {
          console.log('Token refreshed successfully, retrying request');
          // Retry the request with the new token
          const retryHeaders: Record<string, string> = {
            ...options.headers,
            "Authorization": `Bearer ${newToken}`,
          };

          const retryResponse = await fetch(url, {
            method: options.method,
            headers: retryHeaders,
            body: options.body ? JSON.stringify(options.body) : undefined,
            cache: options.cache || "no-store",
          });

          const retryResponseData = await retryResponse.json().catch(() => ({}));

          // Check if retry was successful
          const hasStandardWrapper = 'success' in retryResponseData || 'data' in retryResponseData || 'error' in retryResponseData;

          if (!hasStandardWrapper && retryResponse.ok) {
            return {
              success: true,
              message: retryResponseData.message,
              status: retryResponse.status,
              meta: retryResponseData.meta,
              data: retryResponseData,
              error: undefined,
            };
          }

          return {
            success: retryResponseData.success ?? retryResponse.ok,
            message: retryResponseData.message,
            status: retryResponse.status,
            meta: retryResponseData.meta,
            data: retryResponseData.data,
            error: retryResponseData.error,
          };
        }
      } catch (refreshError) {
        console.warn('Token refresh failed:', refreshError);
      }

      // If refresh failed or wasn't attempted, clear tokens and redirect
      tokenService.clearTokens();

      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }

      return {
        success: false,
        message: responseData.message || 'Authentication required',
        status: response.status,
        error: responseData.error || 'Unauthorized',
        data: undefined,
      };
    }

    // Check if response already has standard wrapper (success, message, data fields)
    const hasStandardWrapper = 'success' in responseData || 'data' in responseData || 'error' in responseData;
    
    // If no standard wrapper but response is ok, wrap the entire response as data
    if (!hasStandardWrapper && response.ok) {
      return {
        success: true,
        message: responseData.message,
        status: response.status,
        meta: responseData.meta,
        data: responseData,
        error: undefined,
      };
    }

    return {
      success: responseData.success ?? response.ok,
      message: responseData.message,
      status: response.status,
      meta: responseData.meta,
      data: responseData.data,
      error: responseData.error,
      ...responseData, // Include all other fields from backend response
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network Error",
      error,
    };
  }
}

export const apiClient = {
  initialize(config: Partial<ApiConfig>): void {
    apiConfig = { ...DEFAULT_CONFIG, ...config };
  },

  getConfig(): ApiConfig {
    return { ...apiConfig };
  },

  clearCache(url?: string): void {
    if (!url) {
      console.warn("Cache cleared globally (no caching layer implemented)");
    } else {
      console.warn(`Cache cleared for: ${url}`);
    }
  },

  get<T>(
    endpoint: string,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: "POST", body: data });
  },

  put<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: "PUT", body: data });
  },

  patch<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: "PATCH", body: data });
  },

  delete<T>(
  endpoint: string,
  data?: unknown, // Add this parameter
  options: Omit<RequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { 
    ...options, 
    method: "DELETE", 
    body: data // Add the data as body
  });
},
};
