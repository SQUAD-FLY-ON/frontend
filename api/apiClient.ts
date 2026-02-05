import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (!response.data || !response.data.httpStatusCode) {
      return response;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url === '/tokens') {
      useAuthStore.getState().clearAuthState();
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || (error.response?.status === 404 && useAuthStore.getState().accessToken && useAuthStore.getState().refreshToken && useAuthStore.getState().isInitializing)) {
      const refreshed = await useAuthStore.getState().refreshAccessToken();
      if (refreshed) {
        const token = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } else {
        useAuthStore.getState().clearAuthState();
        return Promise.reject(error);
      }
    }
    else {
      return Promise.reject(error);
    }
  }
);

