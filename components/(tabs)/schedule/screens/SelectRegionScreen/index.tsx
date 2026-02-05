import { Screens } from "@/constants/screens";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import SelectAreaRegion from "./SelectAreaRegion";
import SelectSubRegion from "./SelectSubRegion";

export default function RegionSelectScreen() {
  const {currentStep,refreshSelectedActivities, selectedRegion} = useScheduleStore(useShallow(state => ({currentStep: state.currentStep, refreshSelectedActivities: state.refreshSelectedActivities, selectedRegion: state.selectedRegion})));
  const currentKey = Screens[currentStep].key;
    useEffect(() => {
    refreshSelectedActivities();
  }, [selectedRegion])
  return (
    <>
      {currentKey === 'SelectAreaRegion' && <SelectAreaRegion />}
      {currentKey === 'SelectSubRegion' && <SelectSubRegion />}
    </>
  );
}
