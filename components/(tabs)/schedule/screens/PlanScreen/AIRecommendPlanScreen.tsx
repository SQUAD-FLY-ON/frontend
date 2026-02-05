// AIRecommendPlanScreen.tsx
import { Screens } from "@/constants/screens";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Filter from "../../Filter";
import TitleHeader from "../TitleHeader";
import PlanCard from "./PlanCard";

export default function AIRecommendPlanScreen() {
  const currentStep = useScheduleStore(state => state.currentStep);
  const schedule = useScheduleStore(state => state.schedule);
  const label = Screens[currentStep].label;
  const description = Screens[currentStep].description!;
  const [currentDay, setCurrentDay] = useState('0');
  const days = schedule.map((_, index) => ({
  key: index.toString(),      // "0", "1", "2", ...
  text: `Day ${index + 1}`    // "Day 1", "Day 2", "Day 3", ...
}));
  

  // 현재 선택된 날짜의 스케줄만 가져오기
  const currentDaySchedule = schedule[parseInt(currentDay)] || [];

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 5 }}>
        <TitleHeader title={label} description={description} />
      </View>
      <Filter filters={days} currentFilter={currentDay} setCurrentFilter={setCurrentDay} />
       <FlatList 
        style={{ marginVertical: 21, width: '100%', marginLeft: 2 }}
        contentContainerStyle={styles.planContainer}
        data={currentDaySchedule}
        keyExtractor={(item) => item.fullAddress}
        renderItem={({ item, index }) => (
          <PlanCard 
            isLast={index === currentDaySchedule.length - 1} 
            index={index} 
            item={item} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>일정이 없습니다</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 3,
    paddingRight: 14,
    flex: 1,
  },
  planContainer: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
})