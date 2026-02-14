import { apiClient } from "@/api/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { TourismSchedule, TourismScheduleData } from "@/types";
import { ApiResponse } from "@/types/api";
import { useModalStore } from "@/store/useModalStore";

export async function fetchTourSchedule(): Promise<TourismSchedule[]> {
  const memberId = useAuthStore.getState().memberInfo?.memberId;
  try {
    const response: ApiResponse<TourismScheduleData> = await apiClient.get(
      `/tourism-schedule`,
      {
        params: { memberId },
      }
    );
    const filteredSchedules = response.data.tourismSchedules.filter(
      (schedule) =>
        schedule.dailyTourismSpots &&
        schedule.scheduleStart &&
        schedule.scheduleEnd &&
        schedule.tourName
    );
    return filteredSchedules;
  } catch {
    useModalStore.getState().showError({ title: "여행 일정 조회에 실패하였습니다.", description: "다시 시도해주세요." });
    return [];
  }
}
