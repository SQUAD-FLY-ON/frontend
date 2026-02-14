import CustomButton from "@/components/CustomButton";
import Colors from "@/constants/colors";
import { useTourSchedule } from "@/hooks/schedule/useTourSchedule";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import CardContents from "./CardContents";

const TravelCard = () => {
  const router = useRouter();

  const { isScheduleLoading, schedule, refetchSchedule } = useTourSchedule();
  
  useFocusEffect(
  useCallback(() => {
    refetchSchedule();
  }, [refetchSchedule])
);
  const onPress = () => {
    const route = schedule?.length ? "/my-schedules" : "/schedule";
    router.push(route);
  };

  // useEffect(() => {
  //   getSchedule();
  //   // setSchedule(mockSchedule);
  // }, []);

  return (
    <View style={styles.travelCard}>
      <CardContents loading={isScheduleLoading} schedule={schedule} />
      <View style={styles.cardBottom}>
        <CustomButton
          onPress={onPress}
          containerStyle={styles.scheduleDetailBtn}
          buttonType={"small"}
          text={schedule?.length ? "일정보기" : "일정생성"}
          rightArrow
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  travelCard: {
    height: "auto",
    flexShrink: 0,
    marginTop: 200,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 4,
  },
  cardTop: {
    paddingTop: 31,
    paddingBottom: 16,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "baseline",
    borderBottomColor: "rgba(208, 208, 208, 0.50)",
    borderBottomWidth: 2,
  },
  title: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 24,
    marginLeft: 1,
  },
  period: {
    color: Colors.text.text50,
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
    marginLeft: 12,
  },
  cardContents: {
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  schedule: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: "#9CC3F9",
  },
  scheduleDay: {
    marginRight: 4,
    color: Colors.text.text70,
    fontFamily: "Pretendard-SemiBold",
    fontSize: 12,
  },
  scheduleLocation: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginHorizontal: 12,
    marginBottom: 12,
  },

  scheduleDetailBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});

export default TravelCard;
