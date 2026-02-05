import Colors from "@/constants/colors";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function LikeButton({ likeNumber }: { likeNumber: number }) {
  return (
    <Pressable style={styles.container}>
      <Image source={require("@/assets/images/ddabong.png")} />
      <Text style={styles.text}>{likeNumber}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    gap: 4,
    borderRadius: 100,
    backgroundColor: "#3A88F41A",
  },
  text: {
    color: Colors.main,
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    paddingTop: 1,
  },
});
