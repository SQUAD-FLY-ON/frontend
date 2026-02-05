import Colors from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

const LevelBadge = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default LevelBadge;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  text: {
    fontFamily: "Pretendard-Bold",
    fontSize: 12,
    color: "#fff",
  },
});
