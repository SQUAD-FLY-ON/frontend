import FloatingButtonIcon from "@/conponents/icons/FloatingButtonIcon";
import { MainGradient } from "@/conponents/LinearGradients/MainGradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

const FlightRecordButton = ({
  isFlying,
  onPress,
}: {
  isFlying: boolean;
  onPress: () => void;
}) => {
  if (isFlying) {
    return (
      <Pressable onPress={onPress}>
        <View style={styles.recordButton}>
          <FloatingButtonIcon width={61.7} />
          <Text style={styles.recordButtonText}>FLY: OFF</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress}>
      <MainGradient style={styles.recordButton}>
        <FloatingButtonIcon width={61.7} />
        <Text style={styles.recordButtonText}>FLY: ON</Text>
      </MainGradient>
    </Pressable>
  );
};

export default FlightRecordButton;

const styles = StyleSheet.create({
  recordButton: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderColor: "#FFF",
    borderWidth: 10,
    marginTop: 49,
    marginBottom: 56,
    backgroundColor: "#B4B4B4",
  },
  recordButtonText: {
    color: "#FFF",
    fontFamily: "Pretendard-Bold",
    fontSize: 20,
  },
});
