import { useScheduleStore } from "@/store/useScheduleStore";
import { StyleSheet, View } from "react-native";
import { useShallow } from "zustand/shallow";
import TitleHeader from "../TitleHeader";
import CustomCalendar from "./Calendar";

export default function CalendarScreen() {
  const title = '여행 날짜 선택하기';
  const description = '일정을 계획할 날짜를 선택해주세요.'
  const { currentMarkedDates, setCurrentMarkedDates } = useScheduleStore(useShallow(state => ({ setCurrentMarkedDates: state.setCurrentMarkedDates, currentMarkedDates: state.currentMarkedDates })))

  return (<View style={styles.container}>
    <TitleHeader title={title} description={description} />
    <CustomCalendar setDates={setCurrentMarkedDates} dates={currentMarkedDates} />
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
