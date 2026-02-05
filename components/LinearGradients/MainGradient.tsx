import Colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

interface Props {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const MainGradient: React.FC<Props> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={Colors.mainGradation.colors}
      locations={Colors.mainGradation.locations}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
