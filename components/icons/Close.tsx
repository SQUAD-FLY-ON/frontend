import React from "react";
import Svg, { Path } from "react-native-svg";

const Close = ({ strokeColor = "white" }) => {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Path
        d="M29.9999 29.9999L20 20M20 20L10 10M20 20L30.0001 10M20 20L10 30.0001"
        stroke={strokeColor}
        strokeWidth={3.33}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Close;
