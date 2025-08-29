import { apiClient } from '@/api/apiClient';
import { AuthResponse, MemberInfo } from '@/types';
import { ApiResponse, LoginRequest } from '@/types/api';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  memberInfo: MemberInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>; // ✅ 메서드 이름 변경
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      memberInfo: null,
      accessToken: null,
      refreshToken: null,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: ApiResponse<AuthResponse> = await apiClient.post('/auth', credentials);
          if (response.httpStatusCode === 200 && response.data) {
            const { accessToken, refreshToken, memberInfo } = response.data;

            set({
              isAuthenticated: true,
              accessToken,
              refreshToken,
              memberInfo: memberInfo || null,
            });

            return { success: true };
          } else {
             return { success: false, error: response.httpStatusMessage || 'Login failed' };
          }

        } catch (error: any) {
          console.error('로그인 실패:', error);
          Alert.alert('아이디 혹은 비밀번호가 올바르지 않습니다.')
          return {
            success: false,
            error: error.response?.data?.message || error.message || 'Network error',
          };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const refreshToken = get().refreshToken;
          if (refreshToken) {
            await apiClient.delete('/tokens', {data: {refreshToken}}).catch((error) => {
              console.warn('서버 로그아웃 요청 실패:', error);
            });
          }
        } catch (error) {
          console.error('로그아웃 중 오류:', error);
        } finally {
          get().clearAuthState();
          set({ isLoading: false });
        }
      },

      refreshAccessToken: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (!refreshToken) {
            get().clearAuthState();
            return false;
          }

          const response: ApiResponse<AuthResponse> = await apiClient.post('/tokens', {
            refreshToken,
          });

          if (response.httpStatusCode === 200 && response.data) {
            const { accessToken, refreshToken: newRefreshToken, memberInfo } = response.data;

            set({
              isAuthenticated: true,
              accessToken,
              refreshToken: newRefreshToken || refreshToken,
              memberInfo: memberInfo || get().memberInfo,
            });

            return true;
          }

          get().clearAuthState();
          return false;
        } catch (error: any) {
          console.error('토큰 갱신 실패:', error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            get().clearAuthState();
          }
          return false;
        }
      },

      clearAuthState: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          memberInfo: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({accessToken: state.accessToken, refreshToken: state.refreshToken, memberInfo: state.memberInfo,})
    }
  )
);
