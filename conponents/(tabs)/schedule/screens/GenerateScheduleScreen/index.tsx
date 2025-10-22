import LoadingComponent from "@/conponents/LoadingComponent";
import { fetchGptSchedule } from "@/libs/schedule/fetchGptSchedule";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";
import BottomAnimationSection from "./BottomAnimation";
import GreenWaveSvg from "./GreenWaveSvg";

export default function GenerateScheduleScreen() {
  const { gotoNextStep, currentMarkedDates, selectedPlaces, selectedActivities, setSchedule} = useScheduleStore(
    useShallow(state => (
      {
        gotoNextStep: state.goToNextStep,
        currentMarkedDates: state.currentMarkedDates,
        selectedPlaces: state.selectedPlaces,
        selectedActivities: state.selectedActivities,
        setSchedule: state.setSchedule,
      })));
  const dates = Object.keys(currentMarkedDates);
  const scheduleStart = dates[0];
  const scheduleEnd = dates[dates.length - 1];

  const { data, isLoading } = useQuery({
    queryKey: ['gptschedule',scheduleStart,scheduleEnd,selectedPlaces,selectedActivities.id],
    queryFn: async () => {
      const apiData = { scheduleStart, scheduleEnd, tourismSpotList: selectedPlaces, paraglidingSpotId: Number(selectedActivities.id)}
      return await fetchGptSchedule(apiData);
    },
    retry: 30, 
  })
  useEffect(() => {
    if(data && !isLoading) {
      setSchedule(data);
      gotoNextStep();
    }
  },[data, isLoading])
  return (<View style={styles.container}>
    <View style={styles.textContainer}>
      <Text style={[styles.text, { marginTop: 72 }]}>선택한 장소를 기반으로</Text>
      <Text style={styles.text}>여행계획을 세우는 중이에요</Text>
      <LoadingComponent />
    </View>
    <BottomAnimationSection />
    <GreenWaveSvg style={styles.topEllipse} />
  </View>)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: -16,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Pretendard',
    fontWeight: 600,
    fontSize: 22,
  },
  lottie: {
    width: 100,
    height: 100,
  },

  topEllipse: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    width: '100%',
  },
});