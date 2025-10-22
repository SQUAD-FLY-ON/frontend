import { apiClient } from "@/api/apiClient";
import { Spot } from "@/types";
import { ApiResponse, SpotRequest } from "@/types/api";


interface MarkerSpotResponse {
  searchedSpots: Spot[];
}
/**
 * 패러글라이딩 스팟 목록 조회 API
 * @returns 성공 시 Place[] 반환, 실패 시 빈 배열 반환
 */
export async function fetchSpots(request: SpotRequest): Promise<Spot[]> {
  try {
    const response: ApiResponse<MarkerSpotResponse> = await apiClient.get("/paragliding-spot", {
      params: request,
    });
    return response.data.searchedSpots;
  } catch (error) {
    console.log("❌ 패러글라이딩 스팟 조회 실패:", error);
    return []; // 실패 시 기본값 반환
  }
}
