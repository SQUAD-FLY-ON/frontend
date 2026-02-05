import { apiClient } from "@/api/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { TourismSchedule, TourismScheduleData } from "@/types";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";

const memberId = useAuthStore.getState().memberInfo?.memberId;

export async function fetchTourSchedule(): Promise<TourismSchedule[]> {
  try {
    const response: ApiResponse<TourismScheduleData> = await apiClient.get(
      `/tourism-schedule`,
      {
        params: { memberId },
      }
    );
    // 필수 값들이 유효한 항목만 필터링
    const filteredSchedules = response.data.tourismSchedules.filter(
      (schedule) =>
        schedule.dailyTourismSpots &&
        schedule.scheduleStart &&
        schedule.scheduleEnd &&
        schedule.tourName
    );
    return filteredSchedules;
  } catch (error) {
    Alert.alert("여행 일정 조회에 실패하였습니다. 다시 시도해주세요.");
    return [];
  }
}

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
