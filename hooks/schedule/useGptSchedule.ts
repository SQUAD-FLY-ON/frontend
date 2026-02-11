import { fetchGptSchedule } from "@/libs/schedule/fetchGptSchedule";
import { TourismItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGptSchedule = (
  scheduleStart: string,
  scheduleEnd: string,
  selectedPlaces: TourismItem[],
  paraglidingSpotId: number,
) => {
  return useQuery({
    queryKey: ["gptschedule", scheduleStart, scheduleEnd, selectedPlaces, paraglidingSpotId],
    queryFn: () =>
      fetchGptSchedule({
        scheduleStart,
        scheduleEnd,
        tourismSpotList: selectedPlaces,
        paraglidingSpotId,
      }),
    retry: 30,
    retryDelay: 2000,
    staleTime: 0,
    gcTime: 0,
  });
};
