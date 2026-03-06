import Colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../CustomButton";
import LikeButton from "../../LikeButton";

export default function Community() {
  const likeNumber = 132;
  const dummyPost = {
    profile: {
      image: "",
      nickname: "북한산 날다람쥐",
    },
    createDate: "2025.06.21",
    thumbnail: require("@/assets/images/dummy_image_community.png"),
    title:
      "[양평 패러글라이딩장 추천] 패러글라이딩 덕분에 몸도, 마음도 훨훨 날았던 하루🌿",
    description:
      "패러글라이딩은 그냥 하늘을 나는 액티비티라고만 생각했는데, 막상 날아보니 몸뿐 아니라 마음까지도 가벼워지는 느낌이었어요.패러글라이딩은 그냥 하...",
  };
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>커뮤니티 인기 게시글</Text>
      <View style={styles.postInfoRow}>
        <View style={styles.profile}>
          <Image style={styles.profileImg} />
          <View style={styles.info}>
            <Text style={styles.nickname}>북한산 날다람쥐</Text>
            <Text style={styles.date}>2025.05.31</Text>
          </View>
        </View>
        <LikeButton likeNumber={likeNumber} />
      </View>
      <Image source={dummyPost.thumbnail} style={styles.communityImage} />
      <View style={styles.postContentContainer}>
        <Text style={styles.postTitle}>{dummyPost.title}</Text>
        <Text
          style={styles.postDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {dummyPost.description}
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={() => {
            router.push("/community");
          }}
          containerStyle={styles.buttonPosition}
          text="더보기"
          bottomArrow
          buttonType={"small"}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 16,
    gap: 16,
    marginTop: 16,
  },
  title: {
    marginTop: 8,
    fontFamily: "Pretendard-Bold",
    color: Colors.text.text100,
    fontSize: 22,
  },
  postInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    gap: 8,
    flexDirection: "row",
  },
  profileImg: {
    borderRadius: 999,
    width: 36,
    height: 36,
    backgroundColor: "#CFEDFF",
  },
  info: {},
  nickname: {
    color: Colors.text.text100,
    fontFamily: "Pretendard-SemiBold",
    fontSize: 14,
  },
  date: {
    color: Colors.text.text50,
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
  },
  communityImage: {
    width: "100%",
    height: 300,
  },
  postTitle: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 18,
    color: Colors.text.text100,
    width: "100%",
  },
  postDescription: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: Colors.text.text50,
    width: "100%",
  },
  buttonPosition: {
    position: "absolute",
    zIndex: 2,
  },
  postContentContainer: {
    width: "100%",
    gap: 8,
    marginBottom: 32,
  },
  buttonWrapper: {
    position: "relative",
    alignItems: "center",
  },
});
