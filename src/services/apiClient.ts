import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  isAccessTokenExpired,
  tryRefreshAccessToken,
  emitAuthExpired,
} from "../utils/jwt";

const apiClient = axios.create({
  baseURL: "https://fitopiaapi.pythonanywhere.com/api",
});

let refreshPromise: Promise<string | null> | null = null;

async function ensureFreshToken(): Promise<string | null> {
  let token = getAccessTokenFromStorage();
  if (token && !isAccessTokenExpired(token)) return token;

  const refresh = getRefreshTokenFromStorage();
  if (!refresh) {
    emitAuthExpired();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = tryRefreshAccessToken(refresh).finally(() => {
      refreshPromise = null;
    });
  }
  token = await refreshPromise;
  if (!token) emitAuthExpired();
  return token;
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await ensureFreshToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = getRefreshTokenFromStorage();
      if (refresh) {
        const newToken = await tryRefreshAccessToken(refresh);
        if (newToken) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      }
      emitAuthExpired();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
