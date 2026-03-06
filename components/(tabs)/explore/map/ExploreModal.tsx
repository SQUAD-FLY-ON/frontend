import { MainGradient } from "@/components/LinearGradients/MainGradient";
import useExploreStore from "@/store/exploreStore";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ExploreModal = memo(function ExploreModal() {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const selectedMarkerSpot = useExploreStore(
    (state) => state.selectedMarkerSpot
  );
  const router = useRouter();

  const imageSource = useMemo(
    () => ({ uri: selectedMarkerSpot.imgUrl }),
    [selectedMarkerSpot.imgUrl]
  );

  const handleDetailPress = useCallback(() => {
    router.push(`/(tabs)/explore/detail/${selectedMarkerSpot.id}`);
  }, [selectedMarkerSpot.id, router]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.container}>
        {selectedMarkerSpot.imgUrl === "" ? (
          <Image
            style={styles.image}
            source={require("@/assets/images/dummy_image_activity_area.png")}
          />
        ) : (
          <Image
            source={imageSource}
            style={styles.image}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{selectedMarkerSpot.name}</Text>
          <Text style={styles.address}>{selectedMarkerSpot.fullAddress}</Text>
          {/* <View style={styles.row}>
            <Image source={require('@/assets/images/star.png')} style={styles.star} />
            <Text style={[styles.title, { fontSize: 14 }]}>4.9</Text>
            <Text style={styles.review}>(19)</Text>
          </View> */}
        </View>
        <TouchableOpacity
          onPress={handleDetailPress}
          style={styles.buttonPosition}
        >
          <MainGradient style={styles.button}>
            <Text style={styles.buttonText}>자세히 보기</Text>
          </MainGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

export default ExploreModal;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 132,
    width: "100%",
    zIndex: 999,
    paddingHorizontal: 16,
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    gap: 12,
    flexDirection: "row",
  },
  textContainer: {
    gap: 4,
    marginTop: 2,
  },
  image: {
    width: 88,
    height: 88,
  },
  title: {
    fontFamily: "Pretendard-SemiBold",
    fontWeight: 600,
    fontSize: 16,
  },
  address: {
    fontSize: 12,
    fontFamily: "Pretendard",
    fontWeight: 300,
    color: "#747474",
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  star: {
    width: 18,
    height: 18,
  },
  review: {
    color: "#8E9297",
    fontFamily: "Pretendard-Regular",
  },
  buttonPosition: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,

    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    fontWeight: 400,
  },
});
