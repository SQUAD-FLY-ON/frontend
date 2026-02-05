import { MainGradient } from "@/components/LinearGradients/MainGradient";
import useExploreStore from "@/store/exploreStore";
import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import MenuIcon from "./MenuIcon";

interface MapFloatingButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress: () =>void;
}
export default function MapFloatingButton({ style, onPress }: MapFloatingButtonProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const selectedMarkerSpot = useExploreStore(state => state.selectedMarkerSpot);
  const modalVisible = selectedMarkerSpot.id === '' ? false : true;
  useEffect(() => {
    const translateValue = modalVisible ? -164 : 0;
    Animated.timing(translateY, {
      toValue: translateValue, // 음수값으로 위로 이동
      duration: 300, // 애니메이션 지속시간 (밀리초)
      useNativeDriver: true,
    }).start();
  }, [selectedMarkerSpot])
  return (<TouchableOpacity
    style={[style, {
      transform: [{ translateY: translateY }],
    },]}
    onPress={onPress}
    >
    <MainGradient style={styles.container}>
      <MenuIcon />
    </MainGradient>
  </TouchableOpacity>)
}

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  }
})