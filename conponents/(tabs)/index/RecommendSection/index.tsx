import ActivityAreaCard from "@/conponents/ActivityAreaCard";
import Carousel from "@/conponents/Carousel";
import ArrowDownIcon from "@/conponents/icons/DownArrow";
import Colors from "@/constants/colors";
import { fetchRecommendSpots } from "@/libs/(tabs)/index/fetchRecommendSpots";
import { useLocationStore } from "@/store/locationStore";
import { RecommendSpotCreteria } from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";
import FilterModal from "./FilterModal";
const filterOptions = [
  { key: "DISTANCE", label: "가까운 체험장 추천" },
  { key: "WEATHER", label: "맑은 지역 체험장 추천" },
];

export default function RecommendSection() {
  const filterModalRef = useRef<BottomSheetModal>(null);
  const [currentKey, setCurrentKey] = useState<RecommendSpotCreteria>("DISTANCE");
  const { location: currentLocation, initializeLocation } = useLocationStore(useShallow((state) => ({ location: state.location, initializeLocation: state.initializeLocation })));
  const { data, isLoading } = useQuery({
    queryKey: ['recommendSpots', currentKey], queryFn: () =>
      fetchRecommendSpots({
        criteria: currentKey,
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude
      }),
    enabled: !!currentLocation?.latitude && !!currentLocation?.longitude
  })
  useEffect(() => {
    // 앱 시작 시 위치 정보 초기화
    initializeLocation();
  }, []);

  const handlePresentModalPress = useCallback(() => {
    filterModalRef.current?.present();
  }, []);
  console.log(data);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Pressable onPress={handlePresentModalPress}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {filterOptions.find((value) => value.key === currentKey)?.label}
            </Text>
            <ArrowDownIcon size={18} />
          </View>
        </Pressable>
        <Link href={"/explore"}>
          <Text style={styles.link}>체험장 탐색하기</Text>
        </Link>
      </View>
      { !data ?
       (
        <Text style = {styles.loadingText}>로딩중..</Text>
      ):
       (
      <Carousel
        data={data}
        renderItem={(item) => <ActivityAreaCard item={item} />}
        style={{ paddingLeft: 16, marginBottom: 40 }}
      />
      )}
      <FilterModal
        ref={filterModalRef}
        options={filterOptions}
        currentKey={currentKey}
        setCurrentKey={setCurrentKey}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    marginTop: 48,
  },
  titleContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  title: {
    fontFamily: "Pretendard-Bold",
    fontSize: 22,
    lineHeight: 26,
  },
  link: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    textDecorationLine: "underline",
    color: Colors.text.text50,
  },
  loadingText: {
    fontFamily: "Pretendard-Bold",
    fontSize: 22,
    alignSelf:'center',
    marginBottom:100,
  }
});
