
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

const AirIcon = ({ width = 36, height = 36, color = "white", strokeWidth = 3 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none">
      <Defs>
        <ClipPath id="clip0_143_92">
          <Rect width="36" height="36" fill="white"/>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_143_92)">
        <Path 
          d="M14.2109 23.9998L27.9824 28.9258C28.2138 29.009 28.4608 29.0393 28.7055 29.0148C28.9501 28.9902 29.1861 28.9112 29.3963 28.7837C29.6065 28.6562 29.7856 28.4833 29.9204 28.2777C30.0552 28.0721 30.1423 27.8389 30.1754 27.5953L32.9849 6.3583C33.1559 5.0653 31.8164 4.1008 30.6344 4.6633L3.93592 17.4073C2.61592 18.0373 2.71492 19.9423 4.09492 20.4328L7.75492 21.7348L9.74992 22.4353M19.4999 25.8898L16.5149 30.8788C15.5399 32.0908 13.5764 31.4053 13.5764 29.8543V25.8598C13.5765 25.106 13.8603 24.3798 14.3714 23.8258L20.1779 17.5258" 
          stroke={color} 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};

export default AirIcon;