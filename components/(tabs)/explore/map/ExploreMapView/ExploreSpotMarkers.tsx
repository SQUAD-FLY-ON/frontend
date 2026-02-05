import { fetchSpots } from "@/libs/fetchSpots";
import { calculatePolygonCentroid } from "@/libs/map";
import useExploreStore from "@/store/exploreStore";
import { MarkerSpotApiRequest } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { useShallow } from 'zustand/shallow';
export default function ExploreSpotMarkers() {
  const { selectedRegion, selectedMarkerSpot, setSelectedMarkerSpot, resetSelectedMarkerSpot } = useExploreStore(useShallow((state) => ({ selectedRegion: state.selectedRegion, selectedMarkerSpot: state.selectedMarkerSpot, setSelectedMarkerSpot: state.setSelectedMarkerSpot, resetSelectedMarkerSpot: state.resetSelectedMarkerSpot })));
  const latitudes = selectedRegion.coordinates.map(coord => coord.latitude);
  const longitudes = selectedRegion.coordinates.map(coord => coord.longitude);
  const northEast = { latitude: Math.max(...latitudes), longitude: Math.max(...longitudes) };
  const center = calculatePolygonCentroid(selectedRegion.coordinates);
  const currentLocation: MarkerSpotApiRequest = {
    cornerLatitude: northEast.latitude,
    cornerLongitude: northEast.longitude,
    centerLatitude: center.latitude,
    centerLongitude: center.longitude
  }
  const query = useQuery({ queryKey: ['spots', selectedRegion.name], queryFn: async () => await fetchSpots({sido: selectedRegion.name!}), enabled: currentLocation !== null })
  return (<>
    {query.data?.map((marker) => (
      <Marker
        key={marker.id}
        zIndex={100}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        onPress={() => {
          if (marker.id === selectedMarkerSpot.id) {
            resetSelectedMarkerSpot();
          }
          else {
            setSelectedMarkerSpot(marker)
          }
        }}
      >
        <Callout tooltip>
          <View style={styles.callout}>
            <Text style={styles.calloutText}>
              {marker.name}
            </Text>
          </View>
        </Callout>
      </Marker>
    ))}
  </>)
}
const styles = StyleSheet.create({
  callout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
  calloutText: {
    fontWeight: '400',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
})