import SpotCard from "@/conponents/(tabs)/explore/SpotCard";
import {
  fetchSpotDetail,
  SpotDetailResponse,
} from "@/libs/(tabs)/explore/detail/fetchSpotDetail";
import { fetchSpotTrack } from "@/libs/(tabs)/explore/detail/fetchSpotTrack";
import { useAuthStore } from "@/store/useAuthStore";
import { ITrackData } from "@/types";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WebView, {
  WebViewMessageEvent,
  WebView as WebViewType,
} from "react-native-webview";

export default function Detail() {
  const { id } = useLocalSearchParams();

  const [isReady, setIsReady] = useState<boolean>(false);
  const [spotInfo, setSpotInfo] = useState<SpotDetailResponse | null>(null);
  const [track, setTrack] = useState<ITrackData[] | null>(null);

  const webviewRef = useRef<WebViewType>(null);

  const { CESIUM_TOKEN, CESIUM_WEB_URL } = Constants?.expoConfig?.extra as {
    CESIUM_TOKEN: string;
    CESIUM_WEB_URL: string;
  };

  if (!CESIUM_WEB_URL) {
    throw new Error("CESIUM_WEB_URL이 설정되지 않았습니다");
  }

  const cesiumAccessToken = `
    window.CESIUM_ACCESS_TOKEN = "${CESIUM_TOKEN}";
    true;
  `;

  const spotDetail = async () => {
    const response = await fetchSpotDetail(id as string);
    if (response !== null) {
      setSpotInfo(response);
    }
  };

  const memberId = useAuthStore((state) => state.memberInfo?.memberId);
  const getTrack = async () => {
    console.log("[RN] Fetching track data for id:", id);
    const response = await fetchSpotTrack(id as string, memberId as string);
    console.log("[RN] Track data received:", response?.length, "points");
    if (response !== null) setTrack(response);
  };
  useEffect(() => {
    console.log("id, memberId:", id, memberId);
    if (id && memberId) {
      spotDetail();
      getTrack();
    }
  }, [id, memberId]);

  useEffect(() => {
    console.log(
      "[RN] useEffect triggered - isReady:",
      isReady,
      "track:",
      track?.length
    );
    if (isReady && track && track.length > 0) {
      console.log("[RN] 🚀 Sending flight data with", track.length, "points");
      console.log("[RN] First track point:", track[0]);
      const message = {
        type: "SET_FLIGHT",
        track,
      };
      webviewRef.current?.postMessage(JSON.stringify(message));
      console.log("[RN] ✅ postMessage called");
    } else {
      console.log(
        "[RN] ⏳ Waiting... isReady:",
        isReady,
        "track length:",
        track?.length || 0
      );
    }
  }, [isReady, track]);

  const onMessage = (e: WebViewMessageEvent) => {
    console.log("[RN] 📨 Message received from WebView");
    console.log("[RN] Raw data:", e.nativeEvent.data);

    try {
      const raw = e.nativeEvent.data;
      const data = JSON.parse(raw);
      console.log("[RN] Parsed message type:", data.type);

      if (!data?.type) {
        console.log("[RN] ⚠️ No type in message");
        return;
      }

      if (data.type === "READY") {
        console.log("[RN] ✅ WebView READY received");
        setIsReady(true);
      }

      if (data.type === "PLAY_STARTED") {
        console.log("[RN] ▶️ Play started");
      }

      if (data.type === "ERROR") {
        console.warn("[RN] ❌ WebView error:", data.message);
      }
    } catch (err) {
      console.error("[RN] 💥 Invalid message from webview:", err);
    }
  };

  const onLoadEnd = () => {
    console.log("[RN] 🔄 WebView onLoadEnd called");
  };

  const onLoadStart = () => {
    console.log("[RN] 🔄 WebView onLoadStart called");
  };

  const onError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("[RN] 💥 WebView error:", nativeEvent);
  };

  console.log(
    "[RN] 🔄 Component rendering - track:",
    track?.length,
    "isReady:",
    isReady
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.webveiwContainer}>
          <WebView
            ref={webviewRef}
            source={{
              uri: CESIUM_WEB_URL,
            }}
            injectedJavaScriptBeforeContentLoaded={cesiumAccessToken}
            javaScriptEnabled={true}
            originWhitelist={["*"]}
            onMessage={onMessage}
            onLoadEnd={onLoadEnd}
            onLoadStart={onLoadStart}
            onError={onError}
            style={styles.webview}
            // Android WebGL 이슈 방지를 위한 추가 옵션 (필요 시 주석 해제)
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            domStorageEnabled={true}
          />
          <LinearGradient
            colors={["rgba(245, 245, 245, 0)", "#F5F5F5"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.3886]} // 0% ~ 38.86%
            style={styles.gradient}
          />
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {spotInfo ? spotInfo.name : "ERROR"}
            </Text>
            <View style={styles.scoreContainer}>
              <Image
                source={require("@/assets/images/star.png")}
                style={styles.star}
              />
              <Text style={styles.score}>4.9</Text>
              <Text style={styles.review}>(19)</Text>
            </View>
          </View>
          <SpotCard
            address={
              spotInfo?.fullAddress
                ? spotInfo.fullAddress
                : "등록된 주소 정보가 없습니다"
            }
            phoneNumber={
              spotInfo?.phoneNumber
                ? spotInfo.phoneNumber
                : "등록된 전화번호가 존재하지 않습니다"
            }
            webURL={
              spotInfo?.websiteUrl
                ? spotInfo.websiteUrl
                : "체험장 사이트가 존재하지 않습니다"
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 300,
  },
  webveiwContainer: {
    height: 549,
    width: "100%",
  },
  webview: {
    flex: 1,
    zIndex: -3,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 14,
    position: "absolute",
    top: 500,
    width: "100%",
    height: 300,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Pretendard-Bold",
    fontSize: 24,
  },
  scoreContainer: {
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    width: 18,
    height: 18,
    marginRight: -3,
  },
  score: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 14,
  },
  review: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#8E9297",
  },
});
