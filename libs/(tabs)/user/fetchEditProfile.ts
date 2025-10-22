import { apiClient } from "@/api/apiClient";
import { ApiResponse, EditProfileRequest } from "@/types/api";

/**
 * 프로필 수정 API
 * @returns 성공 시 response 반환, 실패 시 빈 배열 반환 및 알림
 */

export async function fetchEditProfile(
  memberId: string,
  request: EditProfileRequest
): Promise<any> {
  try {
    const response: ApiResponse<any> = await apiClient.put(
      "/members",
      request,
      { params: { memberId } }
    );
    return response;
  } catch (error) {
    console.error("❌ 프로필 수정 실패:", error);
    return []; // 실패 시 기본값 반환
  }
}
