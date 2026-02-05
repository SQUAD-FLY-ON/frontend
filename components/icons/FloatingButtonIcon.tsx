import React from "react";
import Svg, { Path } from "react-native-svg";

const FloatingButtonIcon = ({
  strokeColor = "white",
  width = 68,
  height = 62,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 68 62" fill="none">
      <Path
        d="M26.2114 43.3331L54.5195 53.4587C54.9951 53.6297 55.5029 53.6921 56.0057 53.6416C56.5086 53.5911 56.9938 53.4288 57.4258 53.1667C57.8579 52.9045 58.2259 52.5491 58.503 52.1265C58.7801 51.7038 58.9592 51.2246 59.0273 50.7238L64.8024 7.06999C65.1539 4.41216 62.4005 2.42957 59.9708 3.58582L5.09055 29.7818C2.37722 31.0768 2.58072 34.9927 5.41738 36.0009L12.9407 38.6772L17.0416 40.1172M37.0832 47.2181L30.9474 57.4732C28.9432 59.9646 24.9071 58.5555 24.9071 55.3673V47.1564C24.9072 45.6069 25.4907 44.1143 26.5413 42.9754L38.4769 30.0254"
        stroke={strokeColor}
        strokeWidth={5.28571}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FloatingButtonIcon;
