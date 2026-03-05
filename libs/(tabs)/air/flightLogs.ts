import { apiClient } from "@/api/apiClient";
import {
  ApiResponse,
  myFlightLogsContents,
  postFlightLogRequest,
} from "@/types/api";
import { useModalStore } from "@/store/useModalStore";

/**
 * 비행 기록 생성 API
 * @return 성공 시 response 반환, 실패 시 빈 배열 반환 및 알림
 */
export async function postFlightLog(
  memberId: string,
  request: postFlightLogRequest
): Promise<ApiResponse<myFlightLogsContents> | null> {
  try {
    const response: ApiResponse<myFlightLogsContents> = await apiClient.post(
      "/flight-logs",
      request,
      { params: { memberId: Number(memberId) } }
    );
    return response;
  } catch {
    useModalStore.getState().showError({ title: "비행 기록에 실패하였습니다." });
    return null;
  }
}
