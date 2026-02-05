import { MainGradient } from "@/components/LinearGradients/MainGradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

interface NextButtonProps {
  onPress: () => void;
  style: ViewStyle;
  isPressable: boolean;
}

export default function NextButton({
  onPress,
  style,
  isPressable,
}: NextButtonProps) {
  return (
    <Pressable onPress={onPress} style={style}>
      {isPressable ? (
        <MainGradient style={styles.gradient}>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={32}
            color="#ffffff"
          />
        </MainGradient>
      ) : (
        <MaterialIcons name="keyboard-arrow-right" size={32} color="#ffffff" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
