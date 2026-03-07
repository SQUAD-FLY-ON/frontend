import useExploreStore from '@/store/exploreStore';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useShallow } from 'zustand/shallow';
import ExploreSpotMarkers from './ExploreSpotMarkers';

const ZERO_EDGE_PADDING = { top: 0, right: 0, bottom: 0, left: 0 };

export default function ExploreMap() {
  const mapRef = useRef<MapView | null>(null);
  const { selectedRegion, resetSelectedMarkerSpot } = useExploreStore(useShallow(state => ({ selectedRegion: state.selectedRegion, resetSelectedMarkerSpot: state.resetSelectedMarkerSpot })));
  const { northEast, southWest } = useMemo(() => {
    const lats = selectedRegion.coordinates.map(coord => coord.latitude);
    const lngs = selectedRegion.coordinates.map(coord => coord.longitude);
    return {
      northEast: { latitude: Math.max(...lats), longitude: Math.max(...lngs) },
      southWest: { latitude: Math.min(...lats), longitude: Math.min(...lngs) },
    };
  }, [selectedRegion.coordinates]);
  const [mapReady, setMapReady] = useState(false);
  useFocusEffect(
    useCallback(() => {
      // 화면에 들어올 때
      setMapReady(true);

      return () => {
        // 화면을 나갈 때 cleanup
        setMapReady(false);
      };
    }, [])
  );


  // 현재 해당하는 지역으로 우선 고정
  // const getBoundaries = async (region: Region) => {
  //   if (mapRef.current) {
  //     const { latitude: cornerLatitude, longitude: cornerLongitude } = northEast;
  //     const { latitude: centerLatitude, longitude: centerLongitude } = region;
  //     setCurrentlocation({ cornerLatitude, cornerLongitude, centerLatitude, centerLongitude })
  //   }
  // };
  // useEffect(() => {
  //   const { latitude: cornerLatitude, longitude: cornerLongitude } = northEast;
  //   const { latitude: centerLatitude, longitude: centerLongitude } = center;
  //   setCurrentlocation({ cornerLatitude, cornerLongitude, centerLatitude, centerLongitude })
  // }, [selectedRegion])
  // useFocusEffect(() => {
  //   const { latitude: cornerLatitude, longitude: cornerLongitude } = northEast;
  //   const { latitude: centerLatitude, longitude: centerLongitude } = center;
  //   setCurrentlocation({ cornerLatitude, cornerLongitude, centerLatitude, centerLongitude })
  // })
  const restrictBoundaries = useCallback(() => {
    if (mapRef.current && selectedRegion?.coordinates.length > 0) {
      mapRef.current.setMapBoundaries(northEast, southWest);
    }
  }, [northEast, southWest, selectedRegion?.coordinates.length]);

  const updateMapRegion = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(selectedRegion.coordinates, {
        edgePadding: ZERO_EDGE_PADDING,
        animated: false,
      });
    }
  }, [selectedRegion.coordinates]);

  const handleMapReady = useCallback(() => {
    updateMapRegion();
    restrictBoundaries();
  }, [updateMapRegion, restrictBoundaries]);

  const handleMapPress = useCallback((event: any) => {
    if (event.nativeEvent.action !== 'marker-press')
      resetSelectedMarkerSpot();
  }, [resetSelectedMarkerSpot]);

  return (
    <>
      {

        mapReady &&
        (

          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            userInterfaceStyle={'light'}
            scrollDuringRotateOrZoomEnabled
            onMapReady={handleMapReady}
            onPress={handleMapPress}
          >
            <ExploreSpotMarkers />
            {/* 지도의 범위와 일치 x */}
            {/* <Polygon coordinates={selectedRegion.coordinates} /> */}
          </MapView>
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});
