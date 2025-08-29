import { useAuthStore } from '../store/useAuthStore'; // This is where the import happens
import { apiClient } from './apiClient';

export const setupInterceptors = () => {
  apiClient.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      if (!response.data || !response.data.httpStatusCode) {
        return response;
      }
      return response.data;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshed = await useAuthStore.getState().refreshAccessToken();
        if (refreshed) {
          const token = useAuthStore.getState().accessToken;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
};