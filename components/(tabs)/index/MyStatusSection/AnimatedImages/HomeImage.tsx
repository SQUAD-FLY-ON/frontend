import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

const HomeImage = () => {
  const bounceAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnimation]);
  return (
    <View>
      <Animated.Image
        source={require("@/assets/images/mainpage/glider_original.png")}
        style={[
          styles.gliderImage,
          {
            transform: [{ translateY: bounceAnimation }],
          },
        ]}
        resizeMode="contain"
      />
      <Image
        source={require("@/assets/images/mainpage/mountain_original.png")}
        style={styles.mountainImage}
        resizeMode="contain"
      />
      <Svg
        width={289}
        height={256}
        viewBox="0 0 289 89"
        fill="none"
        style={styles.topEllipse}
      >
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#78C95B" stopOpacity="1" />
            <Stop offset="100%" stopColor="#78C95B" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="28" width="323" height="211" rx="20" fill="url(#grad)" />
        <Path
          d="M194 0C228.514 0 260.922 2.07007 289 5.69434V83.3047C260.922 86.929 228.514 89 194 89C86.8568 89 0 69.0767 0 44.5C0 19.9233 86.8568 0 194 0Z"
          fill="#9FDA8A"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  gliderImage: {
    width: 94,
    height: 94,
    position: "absolute",
    top: -38,
    left: 164,
  },
  mountainImage: {
    width: 206,
    height: 206,
    position: "absolute",
    top: -33,
    right: -31,
    zIndex: 5,
  },
  topEllipse: {
    position: "absolute",
    left: 101,
    zIndex: 2,
  },
});

export default HomeImage;
