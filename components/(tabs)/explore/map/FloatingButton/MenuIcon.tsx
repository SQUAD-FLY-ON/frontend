import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const MenuIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M5 17H19M5 12H19M5 7H19"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MenuIcon;
