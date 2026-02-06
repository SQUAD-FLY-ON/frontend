import { apiClient } from "@/api/apiClient";
import { queryClient } from "@/app/_layout";
import { AuthResponse, MemberInfo } from "@/types";
import { ApiResponse, LoginRequest } from "@/types/api";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  isInitializing: boolean;
  isInitialized: boolean;
  memberInfo: MemberInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>; // ✅ 메서드 이름 변경
  clearAuthState: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false, // 일반 로딩 (로그인, 로그아웃 등)
      isInitializing: false, // 앱 초기화 로딩
      isInitialized: false,
      memberInfo: null,
      accessToken: null,
      refreshToken: null,
      initializeAuth: async () => {
        const { accessToken, refreshToken } = get();
        if (!accessToken || !refreshToken) {
          set({ isInitialized: true });
          return;
        }

        set({ isInitializing: true });
        // 액세스 토큰 유효성 검사 (예: 사용자 정보 요청)
        const userResponse = await apiClient.get("/members");
        if (userResponse.httpStatusCode === 200) {
          set({
            isAuthenticated: true,
            // memberInfo: userResponse.data || get().memberInfo,
            isInitialized: true,
            isInitializing: false,
          });
          return;
        } else {
          get().clearAuthState();
          return;
        }
      },
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: ApiResponse<AuthResponse> = await apiClient.post(
            "/auth",
            credentials
          );
          if (response.httpStatusCode === 200 && response.data) {
            const { accessToken, refreshToken, memberInfo } = response.data;
            set({
              isAuthenticated: true,
              accessToken,
              refreshToken,
              memberInfo: memberInfo || null,
            });

            return { success: true };
          }
          // } else {
          //   console.log(response?.data.serverErrorMessage);
          //   return {
          //     success: false,
          //     error: response.httpStatusMessage || "Login failed",
          //   };
          // }
        } catch (error: unknown) {
          const axiosError = error as { response?: { data?: { serverErrorMessage?: string } } };
          return {
            success: false,
            error:
              axiosError.response?.data?.serverErrorMessage || "로그인에 실패했습니다.",
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
            await apiClient
              .delete("/tokens", { data: { refreshToken } })
              .catch(() => {
              });
            queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
          }
        } catch (error) {
        } finally {
          get().clearAuthState();
          set({ isLoading: false });
        }
      },

      refreshAccessToken: async () => {
        // const queryClient = useQueryClient();

        try {
          const refreshToken = get().refreshToken;
          if (!refreshToken) {
            get().clearAuthState();
            return false;
          }
          const response: ApiResponse<AuthResponse> = await apiClient.post(
            "/tokens",
            {
              refreshToken,
            }
          );
          if (response.httpStatusCode === 201 && response.data) {
            const { accessToken } = response.data;

            set({
              isAuthenticated: true,
              accessToken,
              refreshToken: refreshToken,
              memberInfo: get().memberInfo,
            })
            return true;
          } else {
            get().clearAuthState(); // ✅ 에러 시 상태 초기화
            return false;
          }
        } catch (error: unknown) {
          get().clearAuthState();
          return false;
        }
        finally {
          queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
          set({ isInitializing: false, isInitialized: true });
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
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        memberInfo: state.memberInfo,
      }),
    }
  )
);
