import { fetchSignout } from "@/libs/(tabs)/user/fetchSignout";
import { useAuthStore } from "@/store/useAuthStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useShallow } from "zustand/shallow";

type TMenuItem = {
  name: string;
  link: string;
};
const MenuList = ({ menuItem }: { menuItem: TMenuItem[] }) => {
  const queryClient = useQueryClient();

  const { logout, clearAuthState } = useAuthStore(
    useShallow((state) => ({
      logout: state.logout,
      clearAuthState: state.clearAuthState,
    }))
  );

  const onPress = async (name: string, url: string) => {
    if (name === "프로필 정보 수정하기") {
      router.navigate("/(tabs)/user/profile");
    } else if (name === "비행 기록") {
      console.log("비행 기록 클릭");
      router.navigate("/(tabs)/user/my-flight-records");
    } else if (name === "개인정보처리방침") {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`이 URL을 열 수 없습니다: ${url}`);
      }
    } else if (name === "로그아웃") {
      useScheduleStore.getState().resetAllStates();
      const response = await logout();
      const accessToken = useAuthStore.getState().accessToken;
      if (!accessToken) {
        router.replace("/intro");
      }
    } else if (name === "회원 탈퇴") {
      useScheduleStore.getState().resetAllStates();

      Alert.alert(
        "회원탈퇴", // Alert 제목
        "정말로 회원을 탈퇴하시겠습니까?", // Alert 내용
        [
          {
            text: "취소",
            onPress: () => console.log("회원탈퇴가 취소되었습니다."),
            style: "cancel",
          },
          {
            text: "확인", // '확인' 버튼
            onPress: async () => {
              // '확인'을 눌렀을 때만 기존 탈퇴 로직을 실행합니다.
              const response = await fetchSignout();
              if (response?.httpStatusCode === 200) {
                console.log("회원탈퇴 성공");
                Alert.alert("회원탈퇴가 완료되었습니다.");
                clearAuthState();
                queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
                router.replace("/intro");
              } else {
                // 탈퇴 실패 시 사용자에게 알림
                Alert.alert("오류", "회원탈퇴 처리 중 오류가 발생했습니다.");
              }
            },
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      {menuItem.map((v, idx) => (
        <Pressable
          key={idx}
          style={
            idx !== menuItem.length - 1 ? styles.itemArea : styles.lastItemArea
          }
          onPress={() => onPress(v.name, v.link)}
        >
          <Text
            style={[
              styles.itemText,
              v.name === "회원 탈퇴" && { color: "#FF5858" },
            ]}
          >
            {menuItem[idx].name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 13,
  },
  itemArea: {
    paddingVertical: 17,
    paddingHorizontal: 9,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(208, 208, 208, 0.50)",
  },
  lastItemArea: {
    paddingVertical: 16,
    paddingHorizontal: 9,
    backgroundColor: "#fff",
  },
  itemText: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 18,
  },
});
