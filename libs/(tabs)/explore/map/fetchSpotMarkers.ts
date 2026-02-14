import { apiClient } from "@/api/apiClient";
import { MarkerSpot } from "@/types";
import { ApiResponse, MarkerSpotApiRequest } from "@/types/api";


interface MarkerSpotResponse {
  searchedSpots: MarkerSpot[];
}
/**
 * 패러글라이딩 스팟 목록 조회 API
 * @returns 성공 시 Place[] 반환, 실패 시 빈 배열 반환
 */
export async function fetchSpotMarkers(request: MarkerSpotApiRequest): Promise<MarkerSpot[]> {
  try {
    const response: ApiResponse<MarkerSpotResponse> = await apiClient.get("/paragliding-spot", {
      params: request,
    });
    return response.data.searchedSpots;
  } catch {
    return []; // 실패 시 기본값 반환
  }
}
