import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function BottomAnimationSection() {
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
    <View style = {styles.animationContainer}>
          <View style = {{width: '100%'}}>
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
                </View>
        </View>
  )
}
const styles = StyleSheet.create({
animationContainer:{
    position:'relative',
    paddingHorizontal:44,
    paddingBottom:21,
    width: '100%',
    alignItems: 'center',
  },
  gliderImage: {
    width: 130,
    height: 130,
    position: "absolute",
    top: -8,
    left: -35,
  },
  mountainImage: {
    maxWidth: 302,
    height: 302,
    width: '100%',
    zIndex: 5,
  },
});