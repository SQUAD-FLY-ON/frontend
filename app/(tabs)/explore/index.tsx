import NextStepHint from "@/components/(tabs)/explore/index/hints/NextStepHint";
import RegionSelect from "@/components/(tabs)/explore/index/RegionSelect";
import { BackButton } from "@/components/BackButton";
import { MainGradient } from "@/components/LinearGradients/MainGradient";
import useExploreStore from "@/store/exploreStore";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Index() {
  const selectedRegion = useExploreStore((state) => state.selectedRegion);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => router.back()}/>
      </View>

      <RegionSelect />
      <View style={styles.nextButtonRow}>
        {selectedRegion.key === "" ? (
          <View style={styles.nextButton}>
            <Image
              source={require("@/assets/images/explore_right_arrow.png")}
            />
          </View>
        ) : (
          <>
            <NextStepHint visible={true} />
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/explore/map")}
            >
              <MainGradient style={styles.nextButton}>
                <Image
                  source={require("@/assets/images/explore_right_arrow.png")}
                />
              </MainGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    paddingBottom: 117,
  },
  backButtonContainer: {
    position: "absolute",
    top: 12,
    left: 16,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#D2D2D2",
    alignItems: "center",
    justifyContent: "center",
  },

  nextButtonRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 14,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    gap: 5,
  },
});
