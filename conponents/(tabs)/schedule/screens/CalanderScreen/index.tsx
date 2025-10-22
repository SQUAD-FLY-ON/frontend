import { useScheduleStore } from "@/store/useScheduleStore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import TitleHeader from "../TitleHeader";
import CustomCalander from "./Calander";

export default function CalanderScreen() {
  const title = '여행 날짜 선택하기';
  const description = '일정을 계획할 날짜를 선택해주세요.'
  const { currentMarkedDates, setCurrentMarkedDates } = useScheduleStore(useShallow(state => ({ setCurrentMarkedDates: state.setCurrentMarkedDates, currentMarkedDates: state.currentMarkedDates })))
  const [dates, setDates] = useState(currentMarkedDates);

  useEffect(() => {
    setCurrentMarkedDates(dates);
  }, [dates]);
  return (<View style={{ flex: 1 }}>
    <TitleHeader title={title} description={description} />
    <CustomCalander setDates={setDates} dates={dates} />
  </View>)
}