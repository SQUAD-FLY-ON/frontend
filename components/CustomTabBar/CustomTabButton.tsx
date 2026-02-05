import { pageRoutes } from "@/types";
import { TabTriggerSlotProps } from "expo-router/ui";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
// import CommunityIcon from "./icons/CommunityIcon";
import Colors from "@/constants/colors";
import ExploreIcon from "./icons/ExploreIcon";
import HomeIcon from "./icons/HomeIcon";
import MySchedulesIcon from "./icons/MySchedulesIcon";
import UserIcon from "./icons/UserIcon";

type CustomTabButtonProps = TabTriggerSlotProps & {
  routeName: pageRoutes;
};

function getRouteLabel(routeName: pageRoutes) {
  switch (routeName) {
    case "home":
      return "홈";
    case "explore":
      return "탐색";
    case "my-schedules":
      return "여행일정";
    case "user":
      return "마이";
    default:
      return "";
  }
}

export default function CustomTabButton({
  routeName,
  isFocused,
  ...props
}: CustomTabButtonProps) {
  // routeName에 따라 아이콘 컴포넌트 결정
  const isActive = isFocused ? isFocused : false;
  return (
    <Pressable
      {...props}
      style={[
        styles.button,
      ]}
    >
      {routeName === "home" && <HomeIcon isFocused={isActive} />}
      {routeName === "explore" && <ExploreIcon isFocused={isActive} />}
      {routeName === "my-schedules" && <MySchedulesIcon isFocused={isActive} />}
      {routeName === "user" && <UserIcon isFocused={isActive} />}
      <View style = {styles.textContainer}>
        <Text
          style={[
            styles.text,
            { color: `${isActive ? Colors.main : Colors.text.text50}` },
          ]}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {getRouteLabel(routeName)}
        </Text>
        </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    gap: 4,
    alignItems: "center",
    zIndex: 10,
    overflow: "visible",
    position: 'relative',
    height: 42,
    width:24,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    width:42,
    alignItems: 'center',
  },
  text: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    lineHeight: 12,
  },
});
