import CustomButton from "@/conponents/CustomButton";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import UserGroup from "./icons/UserGroup";

const TravelCard = () => {
  // mock data
  const schedule = [
    "양평 패러러브 패러글라이딩",
    "000 드라마 세트장",
    "양평 해수욕장",
  ];
  const router = useRouter();
  return (
    <View style={styles.travelCard}>
      <View style={styles.cardTop}>
        <Text style={styles.title}>양평 여행 (3일)</Text>
        <Text style={styles.period}> 07.24 - 07. 26</Text>
      </View>
      <View style={styles.cardContents}>
        {schedule.map((v, i) => (
          <View key={i} style={styles.schedule}>
            <View style={styles.circle} />
            <Text style={styles.scheduleDay}>{i + 1}일차</Text>
            <Text style={styles.scheduleLocation}>{v}</Text>
          </View>
        ))}
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.userGroupView}>
          <UserGroup />
          <Text style={styles.userGroupText}>2인</Text>
        </View>
        <CustomButton
          onPress={() => {
            router.push("/schedule");
          }}
          containerStyle={styles.scheduleDetailBtn}
          buttonType={"small"}
          text="일정 보기"
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
    marginTop: 2,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  userGroupView: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    padding: 4,
  },
  userGroupText: {
    color: "#787878",
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
  },
  scheduleDetailBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});

export default TravelCard;
