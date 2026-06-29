/**
 * API Service
 * Handles all API requests with automatic token injection and refresh
 */

import authService from './authService';

export const API_BASE_URL = 'https://fitopiaapi.pythonanywhere.com/api';

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiService {
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

    const authHeader = authService.getAuthHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && authService.getRefreshToken()) {
        const refreshed = await authService.refreshAccessToken();
        if (refreshed) {
          throw new Error('TOKEN_REFRESHED'); // Signal to retry the request
        }
      }

      throw {
        status: response.status,
        message: error.detail || error.message || 'API Error',
        data: error,
      };
    }

    return response.json();
  }

  /**
   * Make GET request
   */
  async get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        ...options,
        method: 'GET',
        headers: this.getHeaders(options),
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      // Retry once if token was refreshed
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
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers: this.getHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      // Retry once if token was refreshed
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
