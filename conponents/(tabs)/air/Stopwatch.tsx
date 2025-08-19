import { Dispatch, SetStateAction, useEffect } from "react";
import { StyleSheet, Text } from "react-native";

const Stopwatch = ({
  isActive,
  seconds,
  setSeconds,
}: {
  isActive: boolean;
  seconds: number;
  setSeconds: Dispatch<SetStateAction<number>>;
}) => {
  useEffect(() => {
    let interval: number | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    const minutesStr = minutes < 10 ? "0" + minutes : String(minutes);
    const secondsStr = seconds < 10 ? "0" + seconds : String(seconds);

    return `${minutesStr} : ${secondsStr}`;
  };

  return <Text style={styles.flightTime}>{formatTime(seconds)}</Text>;
};

export default Stopwatch;

const styles = StyleSheet.create({
  flightTime: {
    color: "#FFF",
    fontFamily: "Pretendard-Regular",
    fontSize: 24,
  },
});
