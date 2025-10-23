import { GlobalModals } from "@/conponents/GlobalModals";
import Header from "@/conponents/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export const queryClient = new QueryClient();

export default function RootLayout() {
  // setupInterceptors();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 모든 쿼리에 대해 1번만 재시도
    },
    mutations: {
      retry: 1, // mutation도 재시도 설정 가능
    },
  },
});
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.ttf"),
    "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.ttf"),
  });
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  // 앱 시작 시 인증 상태 초기화
  useEffect(() => {
    if (fontsLoaded && !isInitialized) {
      initializeAuth();
    }
  }, [fontsLoaded, isInitialized, initializeAuth]);
  console.log(isAuthenticated);
  // 폰트 로딩 또는 인증 초기화가 완료되지 않은 경우 로딩 화면 표시
  if (!fontsLoaded || !isInitialized) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Protected guard={isAuthenticated}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={!isAuthenticated}>
                  <Stack.Screen name="intro" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="login"
                    options={{ header: () => <Header title="로그인" /> }}
                  />
                  <Stack.Screen
                    name="signup"
                    options={{ header: () => <Header title="회원가입" /> }}
                  />
                </Stack.Protected>
              </Stack>
              <GlobalModals />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
