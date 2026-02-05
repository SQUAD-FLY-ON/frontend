// GreenWaveSvg.tsx
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Rect, Stop } from 'react-native-svg';

interface GreenWaveSvgProps {
  style?: StyleProp<ViewStyle>;
}

export default function GreenWaveSvg({style}:GreenWaveSvgProps) {
  return (
    <Svg style={style} width="390" height="143" viewBox="0 0 390 143" fill="none">
      <Rect
        y="45"
        width="390"
        height="98"
        fill="url(#paint0_linear_463_1391)"
      />
      <Ellipse
        cx="195"
        cy="44.5"
        rx="195"
        ry="44.5"
        fill="#9FDA8A"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_463_1391"
          x1="195"
          y1="45"
          x2="205.5"
          y2="232.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#78C95B" />
          <Stop offset="1" stopColor="#78C95B" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
