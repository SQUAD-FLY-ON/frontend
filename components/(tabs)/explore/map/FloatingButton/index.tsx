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
  const selectedMarkerSpotId = useExploreStore(state => state.selectedMarkerSpot.id);
  const modalVisible = selectedMarkerSpotId !== '';
  useEffect(() => {
    const translateValue = modalVisible ? -164 : 0;
    Animated.timing(translateY, {
      toValue: translateValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalVisible])
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