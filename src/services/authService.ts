/**
 * Authentication Service
 * Handles token management, storage, and refresh logic
 */

const TOKEN_KEY = 'fitopia_access_token';
const REFRESH_TOKEN_KEY = 'fitopia_refresh_token';
const TOKEN_EXPIRY_KEY = 'fitopia_token_expiry';

export interface AuthTokens {
  access: string;
  refresh?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

class AuthService {
  /**
   * Save tokens to localStorage
   */
  saveTokens(tokens: AuthTokens, expiryInSeconds: number = 3600): void {
    localStorage.setItem(TOKEN_KEY, tokens.access);
    if (tokens.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    }

    // Set expiry time (current time + expiry in seconds)
    const expiryTime = new Date().getTime() + expiryInSeconds * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    const currentTime = new Date().getTime();
    return currentTime > parseInt(expiryTime, 10);
  }

  /**
   * Check if token exists and is not expired
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Get Authorization header value
   */
  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Clear all tokens and auth data
   */
  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.error('No refresh token available');
        return false;
      }

      const response = await fetch('https://fitopiaapi.pythonanywhere.com/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('Failed to refresh token');
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.saveTokens({
        access: data.access,
        refresh: data.refresh || refreshToken,
      });

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Login user and save tokens
   */
  async login(username: string, password: string): Promise<AuthTokens | null> {
    try {
      const response = await fetch('https://fitopiaapi.pythonanywhere.com/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      this.saveTokens({
        access: data.access,
        refresh: data.refresh,
      });

      return {
        access: data.access,
        refresh: data.refresh,
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearTokens();
    // Optionally call logout API endpoint if needed
  }
}

export default new AuthService();
