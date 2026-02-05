import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { MainGradient } from "./LinearGradients/MainGradient";

interface DynamicButtonProps {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
  isPressable: boolean;
}

export default function CustomDynamicButton({
  onPress,
  style,
  text,
  isPressable,
}: DynamicButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[style, !isPressable && styles.disabled]}
    >
      {isPressable ? (
        <MainGradient style={styles.default}>
          <Text style={styles.text}>{text}</Text>
        </MainGradient>
      ) : (
        <View>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  default: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 20,
    textAlign: "center",
  },
  disabled: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: "#D2D2D2",
  },
});
