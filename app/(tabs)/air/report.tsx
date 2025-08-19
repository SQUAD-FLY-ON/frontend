import Background from "@/conponents/(tabs)/air/Background";
import ReportText from "@/conponents/(tabs)/air/ReportText";
import SaveModal from "@/conponents/(tabs)/air/SaveModal";
import { MainGradient } from "@/conponents/LinearGradients/MainGradient";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Report() {
  const params = useSearchParams() as { time?: string };
  const time = params?.time ? Number(params.time) : 0;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  const minutesStr = minutes < 10 ? "0" + minutes : String(minutes);
  const secondsStr = seconds < 10 ? "0" + seconds : String(seconds);

  const onPressSave = () => {
    console.log("Save Modal Open!");
    setIsModalVisible(true);
  };

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
          <ReportText
            data={{ label: "비행장", value: "양평 패러리브 패러글라이딩" }}
          />
          <ReportText
            data={{
              label: "비행 시간",
              value: `${minutesStr}분 ${secondsStr}초`,
            }}
          />
          <ReportText data={{ label: "비행 고도", value: "000m" }} />
          <ReportText data={{ label: "비행 거리", value: "000m" }} />
          <ReportText data={{ label: "평균 비행 속도", value: "00m/s" }} />
        </View>

        <Pressable onPress={onPressSave}>
          <MainGradient style={styles.flightSaveButton}>
            <Text style={styles.flightSaveButtonText}>비행기록 저장하기</Text>
          </MainGradient>
        </Pressable>
      </View>

      <SaveModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
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
