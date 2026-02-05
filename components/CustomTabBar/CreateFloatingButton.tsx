import { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet } from "react-native";
import { MainGradient } from "../LinearGradients/MainGradient";
import ScheduleIcon from "./icons/ScheduleIcon";
export default function CreateFloatingButton({
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  return (
    <MainGradient style={styles.container}>
      <Pressable {...props}>
        <ScheduleIcon />
      </Pressable>
    </MainGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 999,
    zIndex: 200,
    position: "absolute",
    right: 16,
    bottom: "100%",
    marginBottom: 16,
  },
});
