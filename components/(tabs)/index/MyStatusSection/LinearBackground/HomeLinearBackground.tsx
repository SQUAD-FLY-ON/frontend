import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { height } = Dimensions.get("window");

const HomeLinearBackground = () => {
  return (
    <View style={styles.container}>
      {/* 상단 433px gradient */}
      <LinearGradient
        colors={["#9CD9FF", "#F1FAFF"]}
        style={styles.topGradient}
      />

      {/* 하단 나머지 gradient */}
      <LinearGradient
        colors={["#EAF2FC", "#FFFFFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomGradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  topGradient: {
    height: 433,
    width: "100%",
  },
  bottomGradient: {
    flex: 1,
    width: "100%",
  },
});

export default HomeLinearBackground;
