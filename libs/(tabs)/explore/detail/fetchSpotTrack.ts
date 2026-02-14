import { apiClient } from "@/api/apiClient";
import { ITrackData, ITrackPoints } from "@/types";
import { ApiResponse } from "@/types/api";

/**
 * 체험장 비행 경로 제공 API
 * @returns 성공 시 ITrackData[] 반환, 실패 시 null 반환
 */
export async function fetchSpotTrack(
  spotId: string,
  memberId: string
): Promise<ITrackData[] | null> {
  try {
    const response: ApiResponse<ITrackPoints> = await apiClient.get(
      `/flight-logs/${spotId}/track`,
      {
        params: { flightLogId: spotId, memberId },
      }
    );
    return response.data.points;
  } catch {
    return null;
  }
}
