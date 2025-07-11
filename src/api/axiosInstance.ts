import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshAccessToken } from '@/utils/refreshAccessToken';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE = '/api';

type TokenQueueItem = {
  resolve: (token: string) => void;
  reject: (error: Error | AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: TokenQueueItem[] = [];

const processQueue = (error: Error | AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

// Ендпоінти, які не потребують Authorization заголовка
const noAuthEndpoints = ['/auth/login', '/auth/register'];

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Для цих ендпоінтів взагалі не додаємо Authorization
  if (noAuthEndpoints.some((endpoint) => config.url?.startsWith(endpoint))) {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && config.headers) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !noAuthEndpoints.some((endpoint) => originalRequest.url?.startsWith(endpoint))
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          throw new Error('Failed to refresh token');
        }

        localStorage.setItem('accessToken', newAccessToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (err: unknown) {
        const typedError =
          err instanceof Error || axios.isAxiosError(err)
            ? err
            : new Error('Unknown error during token refresh');

        processQueue(typedError, null);

        // Очищаємо localStorage при невдалому refresh
        localStorage.removeItem('accessToken');

        return Promise.reject(typedError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
