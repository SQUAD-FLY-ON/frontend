import Background from "@/conponents/(tabs)/air/Background";
import Dropdown from "@/conponents/(tabs)/air/Dropdown";
import FlightRecordButton from "@/conponents/(tabs)/air/FlightRecordButton";
import Stopwatch from "@/conponents/(tabs)/air/Stopwatch";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const [hasValue, setHasValue] = useState(false);
  const [isFlyOn, setIsFlyOn] = useState(false);
  const [seconds, setSeconds] = useState<number>(0);

  const onPressRecordButton = () => {
    if (!hasValue) {
      alert("기록하고 싶은 비행 일정을 선택해주세요!");
      return;
    }
    if (!isFlyOn) {
      setIsFlyOn(true);
    } else {
      setIsFlyOn(false);
      router.push({
        pathname: "/(tabs)/air/report",
        params: { time: seconds.toString() },
      });
    }
  };

  const mockItems = [{ label: "양평 여행(07.22-07.24)", value: "양평여행" }];

  useFocusEffect(
    useCallback(() => {
      setHasValue(false);
      setIsFlyOn(false);
      setSeconds(0);
    }, [])
  );

  return (
    <Background>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>비행 기록하기</Text>
        <Text style={styles.description}>
          비행 일정을 선택하여 비행모드로 전환하여 비행을 기록해보세요.
        </Text>
        <Dropdown itemProps={mockItems} setHasValue={setHasValue} />
        <FlightRecordButton isFlying={isFlyOn} onPress={onPressRecordButton} />
        <Stopwatch
          isActive={isFlyOn}
          seconds={seconds}
          setSeconds={setSeconds}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    alignItems: "center",
  },
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
    width: 232,
    textAlign: "center",
    marginBottom: 40,
  },
});
