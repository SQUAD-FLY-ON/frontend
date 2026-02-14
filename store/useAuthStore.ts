import { apiClient } from "@/api/apiClient";
import { queryClient } from "@/app/_layout";
import { AuthResponse, MemberInfo } from "@/types";
import { ApiResponse, LoginRequest } from "@/types/api";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
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
  refreshAccessToken: () => Promise<boolean>;
  clearAuthState: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      isInitializing: false,
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
        try {
          const userResponse: ApiResponse<MemberInfo> = await apiClient.get(
            "/members"
          );
          if (userResponse.httpStatusCode === 200 && userResponse.data) {
            set({
              isAuthenticated: true,
              memberInfo: userResponse.data,
            });
          } else {
            // If token is invalid, clear auth state
            get().clearAuthState();
          }
        } catch {
          get().clearAuthState();
        } finally {
          set({ isInitializing: false, isInitialized: true });
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
          return { success: false, error: "Login failed. Please check your credentials." };
        } catch (error: unknown) {
          const axiosError = error as { response?: { data?: { serverErrorMessage?: string } } };
          return {
            success: false,
            error:
              axiosError.response?.data?.serverErrorMessage || "An unexpected error occurred during login.",
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
              .delete("/tokens", { data: { refreshToken } });
            queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
          }
        } catch (error) {
            console.warn("Failed to logout from server:", error);
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
            });
            queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
            return true;
          } else {
            get().clearAuthState();
            return false;
          }
        } catch {
          get().clearAuthState();
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
