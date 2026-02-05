import Colors from "@/constants/colors";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function CommunityIcon({ isFocused }: { isFocused: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M1 10H6M1 10C1 14.9706 5.02944 19 10 19M1 10C1 5.02944 5.02944 1 10 1M6 10H14M6 10C6 14.9706 7.79086 19 10 19M6 10C6 5.02944 7.79086 1 10 1M14 10H19M14 10C14 5.02944 12.2091 1 10 1M14 10C14 14.9706 12.2091 19 10 19M19 10C19 5.02944 14.9706 1 10 1M19 10C19 14.9706 14.9706 19 10 19"
        stroke={`${isFocused ? Colors.main : "#8E9297"}`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
