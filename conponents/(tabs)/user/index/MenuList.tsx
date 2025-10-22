import { fetchSignout } from "@/libs/(tabs)/user/fetchSignout";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
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

  const showConfirm = useModalStore((state) => state.showConfirm);
  const showAlert = useModalStore((state) => state.showAlert);

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: "로그아웃",
      description: "정말로 로그아웃 하시겠습니까?",
      pressButtonText: "로그아웃",
    });

    if (confirmed) {
      useScheduleStore.getState().resetAllStates();
      await logout();
      const accessToken = useAuthStore.getState().accessToken;
      if (!accessToken) {
        router.replace("/intro");
      }
    }
  };

  const handleWithdrawal = async () => {
    const confirmed = await showConfirm({
      title: "회원탈퇴",
      description: "정말로 회원을 탈퇴하시겠습니까?",
      description2: "탈퇴 시 모든 데이터가 삭제됩니다.",
      pressButtonText: "회원탈퇴",
    });

    if (confirmed) {
      useScheduleStore.getState().resetAllStates();
      const response = await fetchSignout();

      if (response?.httpStatusCode === 200) {
        console.log("회원탈퇴 성공");
        clearAuthState();
        router.replace("/intro");
      } else {
        await showAlert({
          title: "오류",
          description: "회원탈퇴 처리 중 오류가 발생했습니다.",
        });
      }
    }
  };

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
        await showAlert({
          title: "오류",
          description: `이 URL을 열 수 없습니다: ${url}`,
        });
      }
    } else if (name === "로그아웃") {
      await handleLogout();
    } else if (name === "회원탈퇴") {
      await handleWithdrawal();
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
