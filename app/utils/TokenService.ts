import Cookies from 'js-cookie';
import { authApi } from '@/app/api/auth';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

class TokenService {
  private refreshInterval: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  // Decode JWT token to get expiration time
  private decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get token expiration time in milliseconds
  private getTokenExpiration(token: string): number | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return decoded.exp * 1000; // Convert to milliseconds
  }

  // Calculate when to refresh (2 minutes before expiration)
  private calculateRefreshTime(expirationTime: number): number {
    const now = Date.now();
    const timeUntilExpiration = expirationTime - now;
    const refreshBuffer = 2 * 60 * 1000; // 2 minutes before expiration
    
    // If token expires in less than 2 minutes, refresh immediately
    if (timeUntilExpiration <= refreshBuffer) {
      return 0;
    }
    
    return timeUntilExpiration - refreshBuffer;
  }

  // Initialize token refresh
  initTokenRefresh() {
    this.stopTokenRefresh(); // Clear any existing interval
    
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      console.warn('No access token found');
      return;
    }

    const expirationTime = this.getTokenExpiration(accessToken);
    if (!expirationTime) {
      console.warn('Could not determine token expiration');
      return;
    }

    const refreshTime = this.calculateRefreshTime(expirationTime);
    
    console.log(`Token will be refreshed in ${Math.round(refreshTime / 1000 / 60)} minutes`);
    
    // Set timeout to refresh token before it expires
    this.refreshInterval = setTimeout(() => {
      this.refreshAccessToken();
    }, refreshTime);
  }

  // Stop token refresh
  stopTokenRefresh() {
    if (this.refreshInterval) {
      clearTimeout(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh calls
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string | null> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      
      if (!refreshToken) {
        console.warn('No refresh token available');
        this.handleTokenRefreshFailure();
        return null;
      }

      console.log('Refreshing access token...');
      
      const response = await authApi.refreshToken({
        refreshToken: refreshToken
      });

      const data = response.data;

      if (data?.tokens?.accessToken) {
        // Update tokens in cookies
        Cookies.set('accessToken', data.tokens.accessToken, { expires: 7 });
        
        if (data.tokens.refreshToken) {
          Cookies.set('refreshToken', data.tokens.refreshToken, { expires: 30 });
        }

        console.log('Token refreshed successfully');
        
        // Schedule next refresh
        this.initTokenRefresh();
        
        return data.tokens.accessToken;
      }

      console.error('No access token in response');
      this.handleTokenRefreshFailure();
      return null;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails with 401/403, log user out
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.handleTokenRefreshFailure();
      }
      
      return null;
    }
  }

  private handleTokenRefreshFailure() {
    this.stopTokenRefresh();
    this.clearTokens();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Clear all tokens
  clearTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  // Get current access token
  getAccessToken(): string | undefined {
    const token = Cookies.get('accessToken');
    // console.log('TokenService: Getting access token', !!token);
    return token;
  }

  // Get current refresh token
  getRefreshToken(): string | undefined {
    const token = Cookies.get('refreshToken');
    // console.log('TokenService: Getting refresh token', !!token);
    return token;
  }

  // Check if token is expired or will expire soon
  isTokenExpired(token: string, bufferMinutes: number = 2): boolean {
    const expirationTime = this.getTokenExpiration(token);
    if (!expirationTime) return true;
    
    const now = Date.now();
    const buffer = bufferMinutes * 60 * 1000;
    
    return now >= (expirationTime - buffer);
  }

  // Store tokens after login
  storeTokens(tokens: Tokens) {
    // console.log('TokenService: Storing tokens');
    Cookies.set('accessToken', tokens.accessToken, { expires: 7 });
    Cookies.set('refreshToken', tokens.refreshToken, { expires: 30 });
    // console.log('TokenService: Tokens stored, initializing refresh');
    this.initTokenRefresh();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (!accessToken || !refreshToken) return false;
    
    // Check if token is expired
    return !this.isTokenExpired(accessToken, 0);
  }
}

export const tokenService = new TokenService();