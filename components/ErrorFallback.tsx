import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { FallbackProps } from "react-error-boundary";
import CustomButton from "./CustomButton";

export default function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>문제가 발생했습니다</Text>
      <Text style={styles.description}>
        예상치 못한 오류가 발생했습니다.{"\n"}아래 버튼을 눌러 다시 시도해 주세요.
      </Text>
      <CustomButton
        text="다시 시도"
        onPress={resetErrorBoundary}
        containerStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Pretendard-Bold",
    fontSize: 20,
    color: "#222",
    marginBottom: 12,
  },
  description: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    width: "60%",
  },
});
