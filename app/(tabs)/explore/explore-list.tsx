import PlaceCard from "@/conponents/(tabs)/explore/PlaceCard";
import Header from "@/conponents/Header";
import { fetchSpots } from "@/libs/fetchSpots";
import useExploreStore from "@/store/exploreStore";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";

export default function ExploreList() {
  const { selectedRegion, selectedMarkerSpot } = useExploreStore(useShallow(state => ({ selectedRegion: state.selectedRegion, selectedMarkerSpot: state.selectedMarkerSpot })));
  const query = useQuery({ queryKey: ['spots', selectedRegion.name], queryFn: async () => await fetchSpots({ sido: selectedRegion.name! }) })
  const spotMarkers = query.data;
  return (
    <View>
      <Header title="체험장 목록" />
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <View style={styles.TopView}>
          <Text style={styles.TopTitle}>
            &nbsp;&nbsp;•&nbsp;&nbsp;{selectedRegion.name} 체험장 (
            {query.data?.length})
          </Text>
        </View>
        <View style={styles.exploreContainer}>
          {spotMarkers?.map((item) => (
            <PlaceCard
              key={item.id}
              id={item.id}
              image={
                item.imgUrl !== ""
                  ? { uri: item.imgUrl }
                  : require("@/assets/images/dummy_image_activity_area.png")
              }
              title={item.name}
              address={item.fullAddress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 200,
  },
  TopView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  TopTitle: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 22,
  },
  exploreContainer: {
    gap: 12,
  },
});
