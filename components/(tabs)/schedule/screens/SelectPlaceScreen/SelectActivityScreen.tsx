import { useSpots } from "@/hooks/explore/useSpots";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import ActivityList from "./ActivityList";

export default function SelectActivityScreen() {
  const filters = [
    { key: 'popular', text: '인기순' },
    { key: 'score', text: '별점순' },
  ]
  const { selectedRegion, refreshSelectedPlaces } =
  useScheduleStore(useShallow(state => ({ selectedRegion: state.selectedRegion, refreshSelectedPlaces: state.refreshSelectedPlaces })));
  const request = selectedRegion.sigungu !== '' ? { sido: selectedRegion.name, sigungu: selectedRegion.sigungu } : { sido: selectedRegion.name };
  const { data } = useSpots(request);

  useEffect(() => {
    if (data) {
      refreshSelectedPlaces();
    }
  }, [data, refreshSelectedPlaces]);
  return (
    <>
      <ActivityList
        title="체험장/장소 선택하기(1/2)"
        description="일정에 추가하고 싶은 체험장을 선택해주세요."
        filters={filters}
        data={data ?? []}
      />
    </>
  )
}