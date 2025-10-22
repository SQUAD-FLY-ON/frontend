import RegionSelectMapView from "@/conponents/RegionSelectMapView";
import { flyOffFillColor, flyOnFillColor } from "@/constants/regionSelectMap";
import { useScheduleStore } from "@/store/useScheduleStore";
import { selectedRegion } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SelectAreaRegion() {
  const [selectedLocalRegion, setSelectedLocalRegion] = useState<selectedRegion>({ key: '' ,name: '', coordinates: [], sigungu: '' });
  const setSelectedRegion = useScheduleStore(state => state.setSelectedRegion);
  useEffect(() => {
    setSelectedRegion(selectedLocalRegion);
  }, [selectedLocalRegion])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 지역 선택하기(1/2)</Text>
      <View style={{ gap: 5, alignItems: 'center' }}>
        <Text style={styles.guideText}>선택한 날짜 기준 비행하기 좋은 지역을 알려드릴게요</Text>
        <View style={styles.iconsRowContainer}>
          <View style={styles.iconRow}>
            <View style={[styles.square, { backgroundColor: `${flyOffFillColor}` }]}></View>
            <Text style={styles.iconText}>FLY:OFF 지역</Text>
          </View>
          <View style={styles.iconRow}>
            <View style={[styles.square, { backgroundColor: `${flyOnFillColor}` }]}></View>
            <Text style={styles.iconText}>FLY:ON 지역</Text>
          </View>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <RegionSelectMapView selectedRegion={selectedLocalRegion} setSelectedRegion={setSelectedLocalRegion} />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    position: 'relative',
    marginTop: 16,
    gap: 12,
    marginBottom:100,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    fontWeight: 700,
  },
  guideText: {
    color: '#747474',
    fontFamily: 'Pretendard-Regular',

  },
  iconsRowContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  square: {
    width: 10,
    height: 10,
  },
  iconText: {
    fontFamily: 'Pretendard-Regular',
    color: '#000000',
    height: 17,
    lineHeight: 17,
  },
  mapContainer: {
    marginTop: 5,
    flex: 1,
    width: '100%',
  }
});