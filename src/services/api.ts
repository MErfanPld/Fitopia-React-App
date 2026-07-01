/**
 * API Service
 * Handles all API requests with automatic token injection and refresh
 */

import { useAuth } from '../context/AuthContext';

export const API_BASE_URL = 'https://fitopiaapi.pythonanywhere.com/api';

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiService {
  /**
   * Get token from multiple possible storage locations
   */
  private getToken(): string | null {
    return (
      localStorage.getItem('access') ||
      localStorage.getItem('fitopia_auth_token') ||
      localStorage.getItem('fitopia_access_token')
    );
  }

  /**
   * Get refresh token
   */
  private getRefreshToken(): string | null {
    return (
      localStorage.getItem('refresh') ||
      localStorage.getItem('fitopia_refresh_token') ||
      localStorage.getItem('fitopia_refresh_token')
    );
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryString.append(key, String(value));
      });
      url += `?${queryString.toString()}`;
    }

    return url;
  }

  /**
   * Get headers with authentication
   */
  private getHeaders(options?: ApiRequestOptions): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('API Request with token:', token.substring(0, 20) + '...');
    } else {
      console.warn('No token available for API request');
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let error: any = {};
      
      try {
        error = await response.json();
      } catch {
        error = { detail: `HTTP ${response.status}: ${response.statusText}` };
      }

      // ✅ BETTER LOGGING for debugging
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: error,
        message: error.detail || error.message || error.non_field_errors?.[0] || 'Unknown error',
      });

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          console.log('Token expired, attempting refresh...');
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            throw new Error('TOKEN_REFRESHED');
          }
        }
      }

      throw {
        status: response.status,
        message: error.detail || error.message || error.non_field_errors?.[0] || 'API Error',
        data: error,
      };
    }

    return response.json();
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.error('No refresh token available');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        console.error('Token refresh failed');
        return false;
      }

      const data = await response.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('fitopia_auth_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('fitopia_refresh_token', data.refresh);
      }

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Make GET request
   */
  async get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      console.log('GET:', url);
      const response = await fetch(url, {
        ...options,
        method: 'GET',
        headers: this.getHeaders(options),
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'TOKEN_REFRESHED') {
        const url = this.buildUrl(endpoint, options?.params);
        const response = await fetch(url, {
          ...options,
          method: 'GET',
          headers: this.getHeaders(options),
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  /**
   * Make POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      console.log('📤 POST:', url, 'with data:', data);
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers: this.getHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'TOKEN_REFRESHED') {
        const url = this.buildUrl(endpoint, options?.params);
        const response = await fetch(url, {
          ...options,
          method: 'POST',
          headers: this.getHeaders(options),
          body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  /**
   * Make PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        ...options,
        method: 'PUT',
        headers: this.getHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'TOKEN_REFRESHED') {
        const url = this.buildUrl(endpoint, options?.params);
        const response = await fetch(url, {
          ...options,
          method: 'PUT',
          headers: this.getHeaders(options),
          body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  /**
   * Make PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        ...options,
        method: 'PATCH',
        headers: this.getHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'TOKEN_REFRESHED') {
        const url = this.buildUrl(endpoint, options?.params);
        const response = await fetch(url, {
          ...options,
          method: 'PATCH',
          headers: this.getHeaders(options),
          body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        ...options,
        method: 'DELETE',
        headers: this.getHeaders(options),
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'TOKEN_REFRESHED') {
        const url = this.buildUrl(endpoint, options?.params);
        const response = await fetch(url, {
          ...options,
          method: 'DELETE',
          headers: this.getHeaders(options),
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }
}

export default new ApiService();
