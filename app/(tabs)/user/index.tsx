import Level from "@/components/(tabs)/user/index/Level";
import MenuList from "@/components/(tabs)/user/index/MenuList";
import Profile from "@/components/(tabs)/user/index/Profile";
import Header from "@/components/Header";
import { useMemberInfo } from "@/hooks/user/useMemberInfo";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const innerPages = [
  {
    name: "비행 기록",
    link: "/user/flight-records",
  },
  {
    name: "개인정보처리방침",
    link: "https://caring-terrier-504.notion.site/Fly-On-268edf14ec908039a2f2dae5dd9e94c1?source=copy_link",
  },
  { name: "로그아웃", link: "" },
  { name: "회원탈퇴", link: "" },
];

const level = {
  남산: 1,
  관악산: 2,
  인왕산: 3,
  북한산: 4,
  무등산: 5,
  치악산: 6,
  태백산: 7,
  설악산: 6,
  한라산: 9,
  백두산: 10,
};

export type FlightLevel = keyof typeof level;

export default function Index() {
  const { memberInfo, isLoading } = useMemberInfo();

  function getValue(key: FlightLevel) {
    return level[key];
  }

  if (isLoading || memberInfo === null) {
    return (
      <View>
        <Text>로딩중</Text>
      </View>
    );
  }

  return (
    <View>
      <Header title="마이페이지" backButton={false} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Profile
          level={memberInfo.gliderBadge}
          nickname={memberInfo.nickname}
        />
        <Level
          level={getValue(memberInfo.gliderBadge)}
          title={memberInfo.gliderBadge}
          left={memberInfo.badgeAltitude - memberInfo.totalJumpAltitude}
          proportion={memberInfo.totalJumpAltitude / memberInfo.badgeAltitude}
        />
        <MenuList menuItem={innerPages} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: Dimensions.get("window").width,
    paddingBottom: 200,
    alignItems: "center",
    paddingHorizontal: 19,
  },
});
