import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const RadioButton = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.radioContainer}>
    <View style={[styles.outerCircle, selected && styles.outerCircleSelected]}>
      {selected && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </Pressable>
);
const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 12.5,
    gap: 10,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  outerCircleSelected: {
    borderColor: "#3488f4",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3488f4",
  },
  radioLabel: {
    // paragraph 1
    fontFamily: "Pretendard-Regular",
    fontSize: 18,
    lineHeight: 21,
    height: 21,
  },
});
