import { TabTriggerSlotProps } from "expo-router/ui";
import { Image, Pressable, StyleSheet } from "react-native";
import { MainGradient } from "../LinearGradients/MainGradient";
export default function AirFloatingButton({ ...props }: TabTriggerSlotProps) {
  return (
    <MainGradient style={styles.container}>
      <Pressable {...props}>
        <Image source={require("@/assets/images/floatingButtonImage.png")} />
      </Pressable>
    </MainGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 999,
    zIndex: 200,
    marginTop: -40,
  },
});
