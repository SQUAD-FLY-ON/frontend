import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ExploreHeader({ text }: { text?: string }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="keyboard-arrow-left" size={34} color="#333" />
      </TouchableOpacity>
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    left: 20,
    top: 20,
    alignItems: "center",
  },
  text: {
    // fontFamily: "Pretendard-Bold"
    fontWeight: 700,
    fontSize: 24,
  },
});
