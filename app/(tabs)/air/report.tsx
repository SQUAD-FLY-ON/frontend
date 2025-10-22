import Background from "@/conponents/(tabs)/air/Background";
import ReportText from "@/conponents/(tabs)/air/ReportText";
import ConfirmModal from "@/conponents/ConfirmModal";
import { MainGradient } from "@/conponents/LinearGradients/MainGradient";
import { postFlightLog } from "@/libs/(tabs)/air/flightLogs";
import { getAllFlightLogs, saveFlightLog } from "@/store/flightLogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse, myFlightLogsContents, postFlightLogRequest } from "@/types/api";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import haversine from "haversine-distance";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Report() {
  const params = useLocalSearchParams();

  const memberId = useAuthStore((state) => state.memberInfo?.memberId);
  const airfieldName = params?.airfieldName as string;
  const flightTime = params?.time ? Number(params.time) : 0;
  const router = useRouter();
  const locationData = params?.locationData
    ? JSON.parse(params.locationData as string)
    : [];
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const minutes = Math.floor(flightTime / 60);
  const seconds = flightTime - minutes * 60;
  const minutesStr = minutes < 10 ? "0" + minutes : String(minutes);
  const secondsStr = seconds < 10 ? "0" + seconds : String(seconds);

  // 비행 고도, 비행 거리
  let maxAltitude = 0;
  let flightDistance = 0;

  let coordinate = { latitude: 0, longitude: 0 };
  for (let { lat, lon, alt } of locationData) {
    if (coordinate.latitude === 0) {
      coordinate.latitude = lat;
      coordinate.longitude = lon;
    } else {
      flightDistance += haversine(coordinate, {
        latitude: lat,
        longitude: lon,
      });
      coordinate.latitude = lat;
      coordinate.longitude = lon;
    }
    maxAltitude = Math.max(maxAltitude, alt);
  }

  // 평균 비행 속도
  const averageSpeed = flightDistance / seconds;

  // POST 비행기록
  async function onPressSave() {
    // 위치 정보 제외한 비행 경로 관련 데이터 서버에 POST

    const data: postFlightLogRequest = {
      airfieldName,
      flightTime,
      flightDistance,
      averageSpeed,
      flightAltitude: maxAltitude,
    };

    const response: ApiResponse<myFlightLogsContents> | null =
      await postFlightLog(memberId as string, data);
    console.log(response);

    if (!response) {
      console.log("비행 기록을 저장하는 과정에 오류가 발생했습니다");
      return;
    }

    // API response로 받은 id값과 비행 경로 저장
    const id = response.data.id;
    const flightLog = await saveFlightLog(id, locationData);
    console.log(`ID ${id}: `, flightLog.success);

    const allFlightLogs = await getAllFlightLogs();
    console.log("전체 비행 기록:", allFlightLogs);

    if (response.httpStatusCode === 200 && flightLog.success) {
      setIsModalVisible(true);
    }
  }

  return (
    <Background>
      <Text style={styles.title}>비행기록 리포트</Text>
      <Text style={styles.description}>
        당신의 비행 데이터를 요약한 리포트를 지금 확인해보세요.
      </Text>

      <View style={styles.reportContainer}>
        <View style={styles.reportTitleBox}>
          <Text style={styles.reportTitle}>REPORT</Text>
        </View>

        <View style={styles.reportTextContainer}>
          <ReportText data={{ label: "비행장", value: airfieldName }} />
          <ReportText
            data={{
              label: "비행 시간",
              value: `${minutesStr}분 ${secondsStr}초`,
            }}
          />
          <ReportText
            data={{ label: "비행 고도", value: `${maxAltitude.toFixed(2)}m` }}
          />
          <ReportText
            data={{
              label: "비행 거리",
              value: `${flightDistance.toFixed(2)}m`,
            }}
          />
          <ReportText
            data={{
              label: "평균 비행 속도",
              value: `${averageSpeed.toFixed(2)}m/s`,
            }}
          />
        </View>

        <Pressable onPress={onPressSave}>
          <MainGradient style={styles.flightSaveButton}>
            <Text style={styles.flightSaveButtonText}>비행기록 저장하기</Text>
          </MainGradient>
        </Pressable>
      </View>

      <ConfirmModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title = '비행기록 저장 완료!'
        description="비행 데이터가 성공적으로 저장되었습니다."
        description2="3D 비행 영상을 확인할까요?"
        onPressConfirm={() => setIsModalVisible(false)}
        pressButtonText = '영상 확인하기'
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 32,
    marginTop: 70,
    marginBottom: 16,
  },
  description: {
    color: "#FFF",
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    width: 212,
    textAlign: "center",
    marginBottom: 20,
  },
  reportContainer: {
    width: 338,
    height: 413,
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    zIndex: 10,
    alignItems: "center",
  },
  reportTitleBox: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 23,
    borderBottomColor: "#D0D0D080",
    borderBottomWidth: 2,
    alignItems: "center",
  },
  reportTitle: {
    color: "#3A88F4",
    fontFamily: "Pretendard-Bold",
    fontSize: 24,
  },
  reportTextContainer: {
    gap: 20,
    paddingTop: 18,
  },
  flightSaveButton: {
    marginTop: 48,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 306,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  flightSaveButtonText: {
    color: "#fff",
    fontFamily: "Pretendard-Medium",
    fontSize: 18,
  },
});
