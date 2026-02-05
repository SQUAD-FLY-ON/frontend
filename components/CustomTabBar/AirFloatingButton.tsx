import { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet } from "react-native";
import { MainGradient } from "../LinearGradients/MainGradient";
import AirIcon from "./icons/AirIcon";
export default function AirFloatingButton({ ...props }: TabTriggerSlotProps) {
  return (
    <MainGradient style={styles.container}>
      <Pressable {...props}>
        <AirIcon />
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
