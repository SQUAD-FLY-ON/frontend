import { RegionName } from '@/types';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import ChungcheongbukProvince from './ChungcheongbukProvince';
import { GangwonProvince } from './GangwonProvince';
import GyeonggiProvince from './GyeonggiProvince';
import GyeongsangbukProvince from './GyeongsangbukProvince';
import { GyeongsangnamProvince } from './GyeongsangnamProvince';
import JejuProvince from './JejuProvince';
import JeollabukProvince from './JeollabukProvince';
import JeollanamProvince from './JeollanamProvince';

type MapComponents = {
  [key in RegionName]: React.ComponentType<any>;
};

const DefaultProvince = GyeonggiProvince;
const ALL_REGION_NAMES: RegionName[] = [
  "서울특별시", "부산광역시", "대구광역시", "광주광역시",
  "대전광역시", "울산광역시", "경기도", "강원도",
  "충청북도", "충청남도", "전라북도", "전라남도", "경상북도",'부산광역시',
  "경상남도", "제주특별자치도"
];

const defaultComponents = Object.fromEntries(
  ALL_REGION_NAMES.map(name => [name, DefaultProvince])
) as MapComponents;

const customComponents: Partial<MapComponents> = {
  '경기도': GyeonggiProvince,
  '강원도': GangwonProvince,
  '경상북도': GyeongsangbukProvince,
  '경상남도': GyeongsangnamProvince,
  '전라북도': JeollabukProvince,
  '전라남도': JeollanamProvince,
  '제주특별자치도': JejuProvince,
  '충청북도': ChungcheongbukProvince,
};
// 컴포넌트를 key-value 형태로 매핑하는 객체
const MAP_COMPONENTS: MapComponents = {
  ...defaultComponents,
  ...customComponents,
};

const SubRegionSvg = ({ province, style }: {province: RegionName; style:StyleProp<ViewStyle>;}) => {
  // `componentType`에 해당하는 컴포넌트를 MAP_COMPONENTS 객체에서 찾습니다.
  // 해당하는 컴포넌트가 없으면 `DefaultComponent`를 사용합니다.
  const ComponentToRender = MAP_COMPONENTS[province] || <></>;

  // 찾은 컴포넌트를 렌더링합니다.
  return <View style = {style}><ComponentToRender /></View>;
};

export default SubRegionSvg;