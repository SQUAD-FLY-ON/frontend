import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import Constants from "expo-constants";
import Close from "@/components/icons/Close";
import MyReportText from "@/components/(tabs)/user/my-flight-records/MyReportText";
import { useLocalSearchParams } from "expo-router";
import { getFlightLog } from "@/store/flightLogStore";
import { ITrackData } from "@/types";

const { height, width } = Dimensions.get("window");

export default function MyFlightDetails() {
  const { id, data } = useLocalSearchParams();
  const reprotData = JSON.parse(data as string);

  // 비행 경로 불러오기
  const [flightLog, setFlightLog] = useState<ITrackData[] | null>(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFlightLog(`${id}`);
        setFlightLog(data);
      } catch (error) {
      }
    };

    loadData();
  }, [id]);

  // 데이터 불러오기

  const [visible, setVisible] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const webviewRef = useRef<WebView>(null);
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

  useEffect(() => {
    if (isReady && flightLog && flightLog.length > 0) {
      const message = {
        type: "SET_FLIGHT",
        track: flightLog,
      };
      webviewRef.current?.postMessage(JSON.stringify(message));
    }
  }, [isReady, flightLog]);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const raw = e.nativeEvent.data;
      const data = JSON.parse(raw);

      if (!data?.type) {
        return;
      }

      if (data.type === "READY") {
        setIsReady(true);
      }
    } catch (err) {
    }
  };

  const onLoadEnd = () => {
  };

  const onLoadStart = () => {
  };

  const onError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="비행 기록" backButton={true} />
      <View style={styles.container}>
        <View style={styles.webviewContainer}>
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
          {!visible && (
            <Pressable
              style={styles.detailButton}
              onPress={() => setVisible(true)}
            >
              <Text>비행기록 상세</Text>
            </Pressable>
          )}
        </View>

        {visible && (
          <View style={styles.overlay}>
            <Pressable
              onPress={() => {
                setVisible(false);
              }}
              style={styles.reportCloseBtn}
            >
              <Close />
            </Pressable>
            <View style={styles.report}>
              <View style={styles.reportTitle}>
                <Text style={styles.reportTitleText}>REPORT</Text>
              </View>
              <View style={styles.myReportTextContainer}>
                <MyReportText
                  data={{
                    label: "비행장",
                    value: reprotData.airfieldName,
                  }}
                />
                <MyReportText
                  data={{
                    label: "비행날짜",
                    value: reprotData.createdAt.slice(0, 10),
                  }}
                />
                <MyReportText
                  data={{
                    label: "비행 시간",
                    value: `${reprotData.flightTime} 초`,
                  }}
                />
                <MyReportText
                  data={{
                    label: "비행 고도",
                    value: `${reprotData.flightAltitude} m`,
                  }}
                />
                <MyReportText
                  data={{
                    label: "비행 거리",
                    value: `${reprotData.flightDistance} m`,
                  }}
                />
                <MyReportText
                  data={{
                    label: "평균 비행 속도",
                    value: `${(
                      reprotData.flightDistance / reprotData.flightTime
                    ).toFixed(3)} m/s`,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },

  webviewContainer: {
    height: "95%",
    width: "100%",
  },
  webview: {
    flex: 1,
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 100,
    position: "absolute",
    bottom: 130,
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  detailButtonText: {
    color: "#333",
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 화면 전체 덮기
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 19,
  },
  reportCloseBtn: {
    position: "absolute",
    right: 0,
    marginTop: 20,
    marginRight: 17,
    zIndex: 10,
  },
  report: {
    marginTop: 24,
  },
  reportTitle: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "rgba(208, 208, 208, 0.50)",
    paddingVertical: 16,
  },
  reportTitleText: {
    fontFamily: "Pretendard-Bold",
    fontSize: 32,
    color: "#FFF",
  },
  myReportTextContainer: {
    gap: 16,
    paddingTop: 16,
  },
});
