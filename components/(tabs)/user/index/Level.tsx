import LevelBadge from "@/components/LevelBadge";
import { StyleSheet, Text, View } from "react-native";

const Level = ({
  level,
  title,
  left,
  proportion,
}: {
  level: number;
  title: string;
  left: number;
  proportion: number;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <LevelBadge text={`LV ${level}`} />
        <Text style={styles.title}>{title} 글라이더</Text>
      </View>
      <View style={styles.gaugeBackground}>
        <View style={[styles.gaugeFill, { width: `${proportion}%` }]} />
      </View>
      <View style={styles.leftContainer}>
        <Text style={styles.leftText}>다음 레벨까지 {left}m</Text>
      </View>
    </View>
  );
};

export default Level;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    marginTop: 15,
    marginBottom: 13,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 14,
  },
  title: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 18,
  },
  gaugeBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#F2F2F2",
    borderRadius: 100,
  },
  gaugeFill: {
    height: 6,
    backgroundColor: "#3A88F4",
    borderRadius: 100,
  },
  leftContainer: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  leftText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: "#8E9297",
  },
});
