import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export default function Logo() {
  return (
    <Svg width={42} height={27} viewBox="0 0 42 27" fill="none">
      <Path
        d="M22.9727 21.7499V5.14062L36.8835 21.3079L36.8835 5.14062"
        stroke="url(#paint0_linear_1195_2452)"
        strokeWidth={9.30493}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.8408 1C19.9326 1.00001 25.6816 6.74905 25.6816 13.8408C25.6816 20.9326 19.9326 26.6816 12.8408 26.6816C5.74905 26.6816 9.793e-06 20.9326 0 13.8408C0 6.74904 5.74904 1 12.8408 1ZM12.8213 8.73047C10.0099 8.73067 7.7306 11.0099 7.73047 13.8213C7.73047 16.6328 10.0098 18.9119 12.8213 18.9121C15.6329 18.9121 17.9121 16.6329 17.9121 13.8213C17.912 11.0098 15.6328 8.73047 12.8213 8.73047Z"
        fill="white"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1195_2452"
          x1="36.8835"
          y1="13.4453"
          x2="22.9727"
          y2="13.4453"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#BCD7FC" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
