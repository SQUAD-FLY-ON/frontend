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
  editProfile: (nickname: string) => void;
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
        } catch (error: any) {
          return {
            success: false,
            error:
              error.response?.data?.serverErrorMessage ||
              "로그인에 실패했습니다.",
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
              .catch((error) => {
                console.warn("서버 로그아웃 요청 실패:", error);
              });
            queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
          }
        } catch (error) {
          console.error("로그아웃 중 오류:", error);
        } finally {
          get().clearAuthState();
          set({ isLoading: false });
        }
      },

      editProfile: (nickname) => {
        console.log("edit Profile: ", nickname);
        set((state) => ({
          memberInfo: state.memberInfo
            ? { ...state.memberInfo, nickname }
            : null,
        }));
        console.log("프로필 수정 결과:", get().memberInfo);
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
          console.log(response);
          if (response.httpStatusCode === 201 && response.data) {
            const { accessToken } = response.data;

            set({
              isAuthenticated: true,
              accessToken,
              refreshToken: newRefreshToken || refreshToken,
              memberInfo: memberInfo || get().memberInfo,
            });
            return true;
          } else {
            console.log("bbbb");
            return false;
          }
        } catch (error: any) {
          console.error("토큰 갱신 실패:", error);
          get().clearAuthState();
          return false;
        } finally {
          queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
          set({ isInitializing: false, isInitialized: true });
          console.log("isLoading false and isInitialized");
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
