import { fetchWeather } from "@/libs/schedule/fetchWeather";
import { useScheduleStore } from "@/store/useScheduleStore";
import { RegionName } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";
import SubRegionSvg from "./SubRegionSvg";
import WeatherCard from "./WeatherCard";

export default function SelectSubRegion() {
  const {selectedRegion, currentMarkedDates} = useScheduleStore(useShallow(state => ({ selectedRegion: state.selectedRegion, currentMarkedDates: state.currentMarkedDates })));
  const dates = Object.keys(currentMarkedDates);
  const tripStart = dates[0]?.replaceAll('-', '');
  const tripEnd = dates[dates.length - 1]?.replaceAll('-', '');
  const goToPrevStep = useScheduleStore(state => state.goToPrevStep);
  useEffect(() => {
    if (selectedRegion.key === '' && selectedRegion.name === '') {
      goToPrevStep();
    }
  }, [selectedRegion]);
  const { data, isError, isLoading } = useQuery({
    queryKey: ['weather', selectedRegion.name,tripStart,tripEnd],
    queryFn: () => fetchWeather({
      // selectedRegion.name을 RegionName 타입으로 간주하라고 알려줌
      sido: selectedRegion.name as RegionName,
      tripStart,
      tripEnd,
    }),
    enabled: selectedRegion.name !== ''
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 지역 선택하기(2/2)</Text>
      <Text style={styles.guideText}>선택한 날짜 기준 비행하기 좋은 지역을 알려드릴게요</Text>
      {selectedRegion.name !== '' && <SubRegionSvg province={selectedRegion.name} style={styles.subRegion} />}
      {data && (
        <FlatList
          data={data}
          renderItem={({ item }) => <WeatherCard weatherData={item} />}
          keyExtractor={(item) => item.sigungu}
          contentContainerStyle={styles.weathercontentContainer}
          style={styles.weatherContainer}
        />
      )}

      {!data && !isLoading && (<View style = {styles.messageContainer}>
        <Text style = {styles.message}>데이터를 불러오는 데 실패했습니다.</Text>
        </View>)
      }
      {isError && (<View style = {styles.messageContainer}>
        <Text style = {styles.message}>데이터를 불러오는 중 오류가 발생했습니다.</Text>
        </View>)
      }
      {
        isLoading && (<View style = {styles.messageContainer}>
            <Text style = {styles.message}>데이터를 불러오고 있습니다.</Text>
          </View> 
        )
      }
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
  subRegion: {
    marginTop: 12,
  },
  iconText: {
    fontFamily: 'Pretendard-Regular',
    color: '#000000',
    height: 17,
    lineHeight: 17,
  },
  weatherContainer: {
    flex: 1,
    width: '100%',
    marginTop: 24,
    marginBottom:8,
  },
  weathercontentContainer: {
    gap: 12,
  },
  messageContainer: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: 'Pretendard-Bold',
    fontSize:20,
  }
});