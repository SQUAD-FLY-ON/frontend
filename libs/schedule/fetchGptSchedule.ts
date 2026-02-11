import { apiClient } from "@/api/apiClient";
import { Schedules } from "@/types";
import { ApiResponse, GptScheduleRequest, ScheduleResponse } from "@/types/api";

function assignClientKeys(schedules: Schedules): Schedules {
  return schedules.map(daySchedule =>
    daySchedule.map(item => ({
      ...item,
      clientKey: `item-${Math.random().toString(36).slice(2)}`,
    }))
  );
}

export async function fetchGptSchedule(request: GptScheduleRequest) {
  const response: ApiResponse<ScheduleResponse> = await apiClient.post('/tourism-schedule/gpt', request);
  return assignClientKeys(response.data.schedules);
}