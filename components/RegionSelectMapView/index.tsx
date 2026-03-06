import RegionPolygon from '@/components/RegionSelectMapView/RegionPolygon';
import { polygons } from '@/constants/polygons';
import { customMapStyle, koreaRegion } from '@/constants/regionSelectMap';
import { convertCoordinatesToPoints } from '@/libs/map';
import { RegionCode, RegionName, selectedRegion } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import React, { SetStateAction, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const EMPTY_REGION: selectedRegion = { name: '' as RegionName, key: '' as RegionCode, coordinates: [] };


/**
 * RegionSelectMapView 컴포넌트의 props를 정의하는 인터페이스.
 * 상위 컴포넌트로부터 현재 선택된 지역과 지역을 변경하는 함수를 받습니다.
 */
interface RegionSelectProps {
  selectedRegion: selectedRegion;
  setSelectedRegion: React.Dispatch<SetStateAction<selectedRegion>>;
}

/**
 * 한국 지도를 렌더링하고, 각 지역별 다각형을 표시하는 컴포넌트입니다.
 * - 사용자의 상호작용(스크롤, 줌 등)을 비활성화하여 정적인 지도를 만듭니다.
 * - `polygons` 데이터를 기반으로 각 지역의 다각형(`RegionPolygon`)을 렌더링합니다.
 * - 다각형을 클릭하면 선택 상태를 토글합니다.
 */
export default function RegionSelectMapView({ selectedRegion, setSelectedRegion }: RegionSelectProps) {
  // `MapView` 컴포넌트 인스턴스에 접근하기 위한 ref를 생성합니다.
  const mapRef = useRef<MapView>(null);
  const isFocused = useIsFocused();

  // 좌표 변환을 캐싱하여 매 렌더마다 재계산 방지
  const polygonData = useMemo(() =>
    polygons.map((region) => ({
      regionCode: region.properties.CTPRVN_CD as RegionCode,
      regionName: region.properties.CTP_KOR_NM,
      coordinates: convertCoordinatesToPoints(region.geometry.coordinates),
    })),
    []
  );

  const handleRegionPress = useCallback((regionCode: RegionCode, regionName: string, coordinates: any[], isSelected: boolean) => {
    if (isSelected) {
      setSelectedRegion(EMPTY_REGION);
    } else {
      setSelectedRegion({
        name: regionName as RegionName,
        key: regionCode,
        coordinates: coordinates,
      });
    }
  }, [setSelectedRegion]);

  return (
    <View style={styles.container}>
      {isFocused &&
        (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={koreaRegion}
            customMapStyle={customMapStyle}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={false}
            rotateEnabled={false}
            moveOnMarkerPress={false}
          >
            {polygonData.map(({ regionCode, regionName, coordinates }) => {
              const isSelected = regionCode === selectedRegion?.key;

              return (
                <RegionPolygon
                  key={regionCode}
                  coordinates={coordinates}
                  regionName={regionName}
                  isSelected={isSelected}
                  onPress={() => handleRegionPress(regionCode, regionName, coordinates, isSelected)}
                />
              );
            })}
          </MapView>
        )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

});