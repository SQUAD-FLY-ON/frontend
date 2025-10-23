
import DetailTravelCard from "@/conponents/(tabs)/my-schedule/DetailTravelCard";
import Filter from "@/conponents/(tabs)/schedule/Filter";
import PlanCard from "@/conponents/(tabs)/schedule/screens/PlanScreen/PlanCard";
import Header from "@/conponents/Header";
import { useTourSchedule } from "@/hooks/useTourSchedule";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Detail() {
  const { id } = useLocalSearchParams();
  const { isScheduleLoading, schedule } = useTourSchedule();
  const currentSchedule = schedule?.find((item) => item.id === id);
  const [currentDay, setCurrentDay] = useState('0');
  const days = currentSchedule?.dailyTourismSpots.map((_, index) => ({
    key: index.toString(),      // "0", "1", "2", ...
    text: `Day ${index + 1}`    // "Day 1", "Day 2", "Day 3", ...
  }));

  // 현재 선택된 날짜의 스케줄만 가져오기
  const currentDaySchedule = currentSchedule?.dailyTourismSpots[parseInt(currentDay)] || [];

  return (
    <>
      <Header title="여행 상세" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
        >
        <DetailTravelCard schedule={currentSchedule} loading={isScheduleLoading} />
        <Text style={styles.title}>상세 일정</Text>
        <Filter setCurrentFilter={setCurrentDay} currentFilter={currentDay} filters={days} />

        <View style={styles.planContainer}>
          {currentDaySchedule.map((item, index) => (
            <PlanCard
              key={item.fullAddress} // 고유한 key 사용
              isLast={index === currentDaySchedule.length - 1}
              index={index}
              item={item}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
  },
  contentContainer: {
    paddingBottom: 160,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: 600,
    fontSize: 24,
    marginTop: 36,
    marginBottom: 16,
  },
  planContainer: {
    width: '100%',
    marginTop: 19,
    marginLeft: 3,
    paddingRight: 16,
  },
});