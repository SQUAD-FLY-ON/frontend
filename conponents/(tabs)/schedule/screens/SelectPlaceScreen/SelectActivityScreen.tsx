import { fetchSpots } from "@/libs/fetchSpots";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";
import ActivityList from "./ActivityList";

export default function SelectActivityScreen() {
  const filters = [
    { key: 'popular', text: '인기순' },
    { key: 'score', text: '별점순' },
  ]
  const { selectedRegion, refreshSelectedPlaces } = 
  useScheduleStore(useShallow(state => ({ selectedRegion: state.selectedRegion, refreshSelectedPlaces: state.refreshSelectedPlaces })));
  console.log(selectedRegion.name);
  const { data } = useQuery({
    queryKey: ['spots', selectedRegion.name, selectedRegion.sigungu], queryFn: async () => {
      refreshSelectedPlaces();
      return await fetchSpots(selectedRegion.sigungu !== '' ? { sido: selectedRegion.name,  sigungu:selectedRegion.sigungu }: {sido: selectedRegion.name})
    },
    // enabled: currentLocation !== null
  })
  return (
    <>
      <ActivityList
        title="체험장/장소 선택하기(1/2)"
        description="일정에 추가하고 싶은 체험장을 선택해주세요."
        filters={filters}
        data={data}
      />
    </>
  )
}