import { apiClient } from "@/api/apiClient";
import { ApiResponse } from "@/types/api";

export interface SpotDetailResponse {
  id: string;
  name: string;
  fullAddress: string;
  imgUrl: string;
  phoneNumber: string;
  websiteUrl: string;
}

/**
 * 체험장 상세 정보 조회 API
 * @returns 성공 시 SpotDetailResponse 반환, 실패 시 null 반환
 */
export async function fetchSpotDetail(
  spotId: string
): Promise<SpotDetailResponse | null> {
  try {
    const response: ApiResponse<SpotDetailResponse> = await apiClient.get(
      `/paragliding-spot/${spotId}`,
      {
        params: { spotId },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
}
