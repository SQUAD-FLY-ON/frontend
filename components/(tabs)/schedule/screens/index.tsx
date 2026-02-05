import { Screens } from "@/constants/screens";
import { useScheduleStore } from "@/store/useScheduleStore";
import { ScreenKey } from "@/types";
import { useShallow } from "zustand/shallow";
import CalendarScreen from "./CalendarScreen";
import CompleteScreen from "./CompleteScreen";
import EditPlanScreen from "./EditPlanScreen";
import GenerateScheduleScreen from "./GenerateScheduleScreen";
import AIRecommendScreen from "./PlanScreen/AIRecommendPlanScreen";
import SelectActivityScreen from "./SelectPlaceScreen/SelectActivityScreen";
import SelectPlaceScreen from "./SelectPlaceScreen/SelectPlaceScreen";
import SelectRegionScreen from "./SelectRegionScreen";

const ScreenMap: Record<ScreenKey, React.ComponentType<any>> = {
  'SelectDate': CalendarScreen ,
  'SelectAreaRegion': SelectRegionScreen,
  'SelectSubRegion': SelectRegionScreen ,
  'SelectActivity': SelectActivityScreen ,
  'SelectPlace': SelectPlaceScreen ,
  'LoadingGenerateSchedule': GenerateScheduleScreen ,
  'AIRecommendPlan': AIRecommendScreen ,
  'EditPlan': EditPlanScreen ,
  "Complete": CompleteScreen,
};
export default function Screen() {
  const { currentStep }  = useScheduleStore(useShallow(state => ({currentStep: state.currentStep})));
  const currentKey = Screens[currentStep].key as keyof typeof ScreenMap;

  const ComponentToRender = ScreenMap[currentKey];
  return (<>
    <ComponentToRender/>
  </>)
}