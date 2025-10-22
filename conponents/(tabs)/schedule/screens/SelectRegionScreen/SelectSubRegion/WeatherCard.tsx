import { useScheduleStore } from "@/store/useScheduleStore";
import { WeatherInfo, WeatherStatus } from "@/types";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/shallow";

export default function WeatherCard({ weatherData }: { weatherData: WeatherInfo }) {
  const {settingSigungu, goToNextStep} = useScheduleStore(useShallow(state => ({settingSigungu: state.settingSigungu, goToNextStep: state.goToNextStep})));
  const imageMap: Record<WeatherStatus, any> = {
    '맑음': require('@/assets/images/sunny.png'),
    '구름조금': require('@/assets/images/partlyCloudy.png'),
    '구름많음': require('@/assets/images/cloudy.png'),
    '흐림': require('@/assets/images/overcast.png'),
    '비': require('@/assets/images/rainy.png'),
    '흐리고 비': require('@/assets/images/rainy.png'),
    '비/눈': require('@/assets/images/sleet.png'),
    '눈': require('@/assets/images/snowy.png'),
  };
  return (<TouchableOpacity onPress = {() => {
    settingSigungu(weatherData.sigungu);
    goToNextStep();
  }} style={styles.container}>
    <View style={styles.regionContainer}>
      <Text style={styles.regionTitle}>{weatherData.sigungu}</Text>
      {/* <Text style={[styles.regionDescription, { marginTop: 4 }]}>20km</Text>
      <Text style={styles.regionDescription}>체험장 수: 12</Text> */}
    </View>
    <FlatList
      horizontal={true}
      data={weatherData.dailyWeathers}
      keyExtractor={(item) => item.monthDate}
      showsHorizontalScrollIndicator={false}
      style={styles.weatherList} // 새로운 스타일
      contentContainerStyle={styles.weatherContainer} // 컨텐츠 스타일
      renderItem={({ item: weather }) => {
        const month = parseInt(weather.monthDate.slice(0, 2), 10);
        const date = parseInt(weather.monthDate.slice(2, 4), 10);
        const minTemp = Math.round(Number(weather.minTemp));
        const maxTemp = Math.round(Number(weather.maxTemp));

        return (
          <View style={styles.weather}>
            <Text style={styles.date}>{month}/{date}</Text>
            <Image
              style={{ width: 36, height: 33 }}
              source={imageMap[weather.sky]}
              resizeMode="contain"
            />
            <Text style={styles.temp}>{minTemp}° / {maxTemp}°</Text>
          </View>
        );
      }}
    />
  </TouchableOpacity>)
}
const styles = StyleSheet.create({
  container: {
    gap: 12,
    flexDirection: 'row',
    width: '100%',
  },
  regionContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 11,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    width: 84,
    justifyContent: 'center',
    alignItems: 'center'
  },
  regionTitle: {
    color: '#333333',
    fontWeight: 600,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  regionDescription: {
    color: '#747474',
    fontWeight: 400,
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
  },
  // FlatList 자체의 스타일 (컨테이너)
  weatherList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 11,
  },
  // FlatList 내부 컨텐츠의 스타일
  weatherContainer: {
    gap: 10,
    paddingHorizontal: 9,
    alignItems: 'center', // 이제 contentContainerStyle에 위치
  },
  weather: {
  },
  date: {
    color: '#3A88F4',
    fontSize: 8,
    fontWeight: 700,
    fontFamily: 'Pretendard-Bold',
  },
  temp: {
    color: '#747474',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 8,
    fontWeight: 600,
    textAlign: 'center',
  }
});