import RegionPolygon from '@/components/RegionSelectMapView/RegionPolygon';
import { polygons } from '@/constants/polygons';
import { customMapStyle, koreaRegion } from '@/constants/regionSelectMap';
import { convertCoordinatesToPoints } from '@/libs/map';
import { RegionCode, RegionName, selectedRegion } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import React, { SetStateAction, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE } from 'react-native-maps';


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
  return (
    <View style={styles.container}>
      {isFocused &&
        (
          <MapView
            ref={mapRef} // MapView 인스턴스에 접근하기 위해 ref를 연결.
            provider={PROVIDER_GOOGLE} // Google Maps 제공자를 사용하도록 지정.
            style={styles.map} // 스타일을 적용합니다.
            region={koreaRegion} // 초기 지도 표시 영역을 한국 전체로 설정합니다.
            customMapStyle={customMapStyle} // 미리 정의된 JSON 스타일을 적용하여 지도의 모습을 커스텀합니다..
            scrollEnabled={true} // 스크롤(지도 이동) 활성화 (작은 지역 누르기 힘듬)
            zoomEnabled={true} // 줌(확대/축소) 활성화 (작은 지역 누르기 힘듬)
            pitchEnabled={false} // 기울기 비활성화
            rotateEnabled={false} // 회전 비활성화
            moveOnMarkerPress={false} // 마커 클릭 시 자동으로 이동하는 기능 비활성화
          >
            {polygons.map((region) => {
              const regionCode = region.properties.CTPRVN_CD as RegionCode;
              const selectedRegionCode = selectedRegion?.key;
              const regionName = region.properties.CTP_KOR_NM;
              const isSelected = regionCode === selectedRegionCode;

              // GeoJSON의 좌표 형식을 `react-native-maps`에서 사용하는 `LatLng` 배열로 변환.
              const coordinates: LatLng[] = convertCoordinatesToPoints(region.geometry.coordinates);

              return (
                <RegionPolygon
                  key={regionCode} // 고유한 `key` prop을 제공하여 렌더링 성능을 최적화합니다.
                  coordinates={coordinates}
                  regionName={regionName}
                  isSelected={isSelected}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedRegion({
                        name: '',
                        key: '',
                        coordinates: [],
                      });
                    } else {
                      // 새로운 지역을 클릭하면 해당 지역으로 선택 상태를 업데이트합니다.
                      setSelectedRegion({
                        name: regionName as RegionName,
                        key: regionCode,
                        coordinates: coordinates,
                      });
                    }
                  }}
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