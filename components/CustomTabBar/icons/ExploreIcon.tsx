import Colors from "@/constants/colors";
import React from "react";
import Svg, { Path } from "react-native-svg";

export default function ExploreIcon({
  isFocused = false,
}: {
  isFocused: boolean;
}) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
        stroke={`${isFocused ? Colors.main : "#8E9297"}`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 10.5L16 8L13.5 13.5L8 16L10.5 10.5Z"
        stroke={`${isFocused ? Colors.main : "#8E9297"}`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
