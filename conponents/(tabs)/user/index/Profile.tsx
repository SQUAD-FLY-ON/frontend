import LevelBadge from "@/conponents/LevelBadge";
import { useAuthStore } from "@/store/useAuthStore";
import { Image, StyleSheet, Text, View } from "react-native";

const Profile = ({ level, nickname }: { level: string; nickname: string }) => {
  const profileImage = useAuthStore((state) => state.memberInfo?.imgUrl);
  console.log("image:", profileImage);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileImgContainer}>
        {profileImage && (
          <Image style={styles.profileImg} source={{ uri: profileImage }} />
        )}
      </View>
      <LevelBadge text={level} />
      <Text style={styles.profileName}>{nickname}님</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    paddingTop: "10%",
    marginBottom: 15,
    alignItems: "center",
  },
  profileImgContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#D3E5FF",
    borderRadius: 30,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    zIndex: 10,
    resizeMode: "cover",
  },
  profileName: {
    fontFamily: "Pretendard-Bold",
    fontSize: 24,
    marginTop: 8,
  },
});
