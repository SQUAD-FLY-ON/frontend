import { subRegionSvgHeight, subRegionSvgWidth } from '@/constants/dimensions';
import * as React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';

const JejuProvince = (props: SvgProps) => (
  <Svg
    width={subRegionSvgWidth}
    height={subRegionSvgHeight}
    viewBox="0 0 74.6 37.26"
    fill="none"
    {...props}
  >
    <Defs>
      <LinearGradient id="a" x1={28.16} y1={2.8} x2={46.5} y2={34.57} gradientUnits="userSpaceOnUse">
        <Stop offset={0} stopColor="#64aefa" />
        <Stop offset={1} stopColor="#acd4ff" />
      </LinearGradient>
    </Defs>
    <G id="_레이어_3" data-name="레이어 3">
      <Path
        id="_제주도"
        data-name="제주도"
        d="M58.32.04c-6.95.48-13.54,3.51-20.49,3.9-3.07.17-6.28-.15-9.09,1.07-1.56.68-2.88,1.79-4.33,2.67-3.39,2.07-7.53,2.88-8.02,1.91-3.41,3.68-7.5,6.74-11.99,8.96-1.73.85-3.71,1.8-4.25,3.66-.27.94-.1,1.95.07,2.91.51,2.87,1.06,5.82,2.63,8.27,1.57,2.45,4.45,4.3,7.32,3.77,2.62-.48,4.53-2.74,6.95-3.86,6.27-2.9,13.37,2.45,20.27,1.99,5.06-.34,9.31-3.72,13.86-5.96,4.91-2.42,10.4-3.56,15.16-6.26,4.76-2.7,8.89-7.72,8.11-13.14C73.51,3.04,65.27-.43,58.32.04Z"
        fill="url(#a)"
      />
    </G>
  </Svg>
);

export default JejuProvince;