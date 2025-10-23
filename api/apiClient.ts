import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';

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
    console.log(response);
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response);
    if (error.response?.status === 401) {
      console.log(error.response.status);

      const refreshed = await useAuthStore.getState().refreshAccessToken();
      console.log(refreshed);
      if (refreshed) {
        const token = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } else {

      }
    }
    else {
      return Promise.reject(error);
    }
    console.log(error.response);

    // Alert.alert 대신 Zustand 스토어 사용
    const errorMessage = error.response?.data?.serverErrorMessage
      || '데이터 요청에 실패했습니다.';

    await useModalStore.getState().showAlert({
      title: '오류',
      description: errorMessage,
      isError: true,
    });

    return Promise.reject(error);
  }
);

