import { apiClient } from "@/api/apiClient";
import { ApiResponse, SignupRequest } from "@/types/api";
import { Alert } from "react-native";

/**
 * 회원가입 API
 * @returns 성공 시 response 반환, 실패 시 빈 배열 반환 및 알림
 */
export async function fetchSignup(request: SignupRequest): Promise<any> {
  try {
    const response: ApiResponse<any> = await apiClient.post("/members", request);
    return response;
  } catch (error) {
    console.log("❌ 회원가입 실패:", error);
    Alert.alert('회원가입에 실패하였습니다. 다시시도해주세요.')
    return []; // 실패 시 기본값 반환
  }
}
