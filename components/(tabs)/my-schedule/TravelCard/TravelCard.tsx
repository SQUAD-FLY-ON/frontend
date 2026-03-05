import CustomButton from "@/components/CustomButton";
import Colors from "@/constants/colors";
import { TourismSchedule } from "@/types";
import React, { memo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import CardContents from "./CardContents";
import UserGroup from "./icons/UserGroup";

const TravelCard = memo(function TravelCard({
  containerStyle, 
  onPress,
  schedule,
  loading = false
}: { 
  containerStyle?: ViewStyle, 
  onPress?: () => void,
  schedule: TourismSchedule | null,
  loading?: boolean
}) {
  return (
    <View style={[styles.travelCard, containerStyle]}>
      <CardContents loading={loading} schedule={schedule} />
      <View style={styles.cardBottom}>
        {schedule ? (
          <View style={styles.userGroupView}>
            <UserGroup />
            {/* <Text style={styles.userGroupText}>2인</Text> */}
          </View>
        ) : null}
        {<CustomButton
          onPress={onPress}
          containerStyle={styles.scheduleDetailBtn}
          buttonType={"small"}
          text={"일정보기"}
          rightArrow
        />
        }
      </View>
    </View>
  );
});

export default TravelCard;

const styles = StyleSheet.create({
  travelCard: {
    height: "auto",
    flexShrink: 0,
    borderRadius: 12,
    backgroundColor: '#ffffff',
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

