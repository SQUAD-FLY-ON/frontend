import { fetchTourSchedule } from "@/libs/schedule/fetchTourSchedule";
import { useQuery } from "@tanstack/react-query";

export const useTourSchedule = () => {
  const {
    isLoading: isScheduleLoading,
    isError: isScheduleError,
    data: schedule,
    isSuccess,
    refetch: refetchSchedule,
  } = useQuery({
    queryKey: ["mySchedule"],
    queryFn: fetchTourSchedule,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return { isScheduleLoading, isScheduleError, schedule, isSuccess, refetchSchedule };
};
