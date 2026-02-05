import Colors from "@/constants/colors";
import { TourismSchedule } from "@/types";
import { StyleSheet, Text, View } from "react-native";

const CardContents = ({
  loading,
  schedule,
}: {
  loading: boolean;
  schedule: TourismSchedule | null;
}) => {
  if (schedule === null) {
    return (
      <View style={styles.emptyContents}>
        <Text style={styles.emptyText}>여행 일정이 비어있어요</Text>
        <Text style={styles.emptyText}>새로운 일정을 만들어보세요!</Text>
      </View>
    );
  }

  const paragliding = {
    spot: "",
    day: 0,
  };

  const formatDate = (dateStr: string) => {
    const [_, month, day] = dateStr.split("-");
    return `${month}.${day}`;
  };

  const startDate = formatDate(schedule.scheduleStart);
  const endDate = formatDate(schedule.scheduleEnd);

  return (
    <>
      <View style={styles.cardTop}>
        <Text style={styles.title}>
          {schedule.tourName?`${schedule.tourName} 여행`: '여행'} (
          {schedule.dailyTourismSpots.length}일)
        </Text>
        <Text style={styles.period}>
          {" "}
          {startDate} - {endDate}
        </Text>
      </View>
      <View style={styles.cardContents}>
        {schedule.dailyTourismSpots?.map((v, i) => (
          <View key={i} style={styles.schedule}>
            <View style={styles.circle} />
            <Text style={styles.scheduleDay}>{i + 1}일차</Text>
            <Text style={styles.scheduleLocation}>
              {i + 1 === paragliding.day ? paragliding.spot : v[0]?.name}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};

export default CardContents;

const styles = StyleSheet.create({
  emptyContents: {
    paddingTop: 80,
    paddingBottom: 60,
  },
  emptyText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 18,
    color: "#747474",
    textAlign: "center",
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
});
