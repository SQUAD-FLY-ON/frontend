import { Screens } from "@/constants/screens";
import { useScheduleStore } from "@/store/useScheduleStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import TitleHeader from "../TitleHeader";
import TravelPlanKanban from "./TravelKanban";

export default function EditPlanScreen() {
  const currentStep = useScheduleStore(state => state.currentStep);
  const label = Screens[currentStep].label;
  const description = Screens[currentStep].description!
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 5 }}>
        <TitleHeader title={label} description={description} />
      </View>
      <TravelPlanKanban />
    </View>
  )
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
})