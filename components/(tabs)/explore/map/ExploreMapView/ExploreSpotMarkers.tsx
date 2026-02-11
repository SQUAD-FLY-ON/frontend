import { useSpots } from "@/hooks/explore/useSpots";
import useExploreStore from "@/store/exploreStore";
import { StyleSheet, Text, View } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { useShallow } from 'zustand/shallow';
export default function ExploreSpotMarkers() {
  const { selectedRegion, selectedMarkerSpot, setSelectedMarkerSpot, resetSelectedMarkerSpot } = useExploreStore(useShallow((state) => ({ selectedRegion: state.selectedRegion, selectedMarkerSpot: state.selectedMarkerSpot, setSelectedMarkerSpot: state.setSelectedMarkerSpot, resetSelectedMarkerSpot: state.resetSelectedMarkerSpot })));
  const { data: spots } = useSpots({ sido: selectedRegion.name! });
  return (<>
    {spots?.map((marker) => (
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