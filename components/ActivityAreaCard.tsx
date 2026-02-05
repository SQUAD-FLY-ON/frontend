// components/MyCard.tsx
import { polygons } from "@/constants/polygons";
import { convertCoordinatesToPoints } from "@/libs/regionSelectMap";
import useExploreStore from "@/store/exploreStore";
import { RecommendSpots } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { useShallow } from "zustand/shallow";

export default function ActivityAreaCard({ item }: { item: RecommendSpots }) {
  const findRegionByName = (name: string) => {
  return polygons.find((region) => region.properties.CTP_KOR_NM === name);
};

  const router = useRouter();
  const { setSelectedRegion, setSelectedMarkerSpot } = useExploreStore(
  useShallow((state) => ({
    setSelectedRegion: state.setSelectedRegion,
    setSelectedMarkerSpot: state.setSelectedMarkerSpot,
  }))
);
  const foundRegion = findRegionByName(item?.sido);
  const coordinates = convertCoordinatesToPoints(foundRegion?.geometry.coordinates)
  return (
    <Pressable style={styles.card} onPress={() => { 
      router.push(`/explore/detail/${item.id}`) ;
      setSelectedRegion({key: foundRegion?.properties.CTPRVN_CD || '',name: item?.sido, coordinates});
      setSelectedMarkerSpot({latitude: item?.latitude, longitude: item?.longitude, id: item?.id, name: item?.spotName});
    }}>
      <Image source={
        item?.imgUrl
          ? { uri: item.imgUrl } : require('@/assets/images/dummy_image_activity_area.png')} style={{ width: 160, height: 160, borderRadius: 16 }} />
      <Text style={styles.text} numberOfLines={2}>
        {item?.spotName}
      </Text>
      <Text style = {styles.secondText}>
        {item?.fullAddress}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    gap: 6,
  },
  text: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 14,
  },
  score: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 14,
  },
  review: {
    fontSize: 14,
    color: "#666",
  },
  secondText: {
    fontFamily: "Pretendard-Regular",
    fontWeight: 300,
    fontSize: 12,
    lineHeight: 12 * 1.4, // 140%
    letterSpacing: 0,

    color: '#747474',
  }
});
