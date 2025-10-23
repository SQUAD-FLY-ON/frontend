import { apiClient } from "@/api/apiClient";
import {
  ApiResponse,
  myFlightLogsContents,
  postFlightLogRequest,
} from "@/types/api";
import { Alert } from "react-native";

/**
 * 비행 기록 생성 API
 * @return 성공 시 response 반환, 실패 시 빈 배열 반환 및 알림
 */
export async function postFlightLog(
  memberId: string,
  request: postFlightLogRequest
): Promise<ApiResponse<myFlightLogsContents> | null> {
  try {
    console.log("[flightLogs] memberId:", memberId, Number(memberId));
    const response: ApiResponse<myFlightLogsContents> = await apiClient.post(
      "/flight-logs",
      request,
      { params: { memberId: Number(memberId) } }
    );
    return response;
  } catch (error) {
    console.log("❌ 비행 기록 실패: ", error);
    Alert.alert("비행 기록에 실패하였습니다.");
    return null;
  }
}
