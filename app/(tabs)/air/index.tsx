import Background from "@/conponents/(tabs)/air/Background";
import Dropdown from "@/conponents/(tabs)/air/Dropdown";
import FlightRecordButton from "@/conponents/(tabs)/air/FlightRecordButton";
import Stopwatch from "@/conponents/(tabs)/air/Stopwatch";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { TLocationData } from "@/types";

export default function Index() {
  const router = useRouter();

  const [ok, setOk] = useState<boolean>();
  const locationDataRef = useRef<TLocationData[]>([]);
  const intervalRef = useRef<null | number>(null);

  const [hasValue, setHasValue] = useState(false);
  const [isFlyOn, setIsFlyOn] = useState(false);
  const [seconds, setSeconds] = useState<number>(0);

  const ask = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (granted === true) setOk(true);
      else setOk(false);
    } catch (err) {
      console.error("현재 위치를 가져오는 중 오류 발생: ", err);
    }
  };

  const saveLocationData = (lat: number, lon: number, alt: number) => {
    locationDataRef.current.push({ lat, lon, alt });
    // console.log(locationDataRef.current);
  };

  const getLocation = async () => {
    try {
      const {
        coords: { latitude, longitude, altitude },
      } = await Location.getCurrentPositionAsync();
      saveLocationData(latitude, longitude, altitude || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const startRecordLocation = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      getLocation();
    }, 3000);
  };

  const stopRecordLocation = () => {
    if (!intervalRef.current) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    // console.log("기록 중단\n");
  };

  const onPressRecordButton = () => {
    if (!hasValue) {
      alert("기록하고 싶은 비행 일정을 선택해주세요!");
      return;
    }
    if (!ok) {
      alert("위치 정보를 가져올 수 없어 비행 기록이 불가능합니다.");
      return;
    }
    if (!isFlyOn) {
      setIsFlyOn(true);
      startRecordLocation();
    } else {
      setIsFlyOn(false);
      stopRecordLocation();
      // console.log("seconds:", seconds, seconds.toString());
      // console.log("locationDataRef.current:", locationDataRef.current);
      router.push({
        pathname: "/(tabs)/air/report",
        params: {
          airfieldName: "양평 패러리브 패러글라이딩",
          time: seconds.toString(),
          locationData: JSON.stringify(locationDataRef.current),
        },
      });
    }
  };

  const mockItems = [{ label: "양평 여행(07.22-07.24)", value: "양평여행" }];

  useEffect(() => {
    ask();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setHasValue(false);
      setIsFlyOn(false);
      setSeconds(0);
      locationDataRef.current = [];
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
