import { apiClient } from "@/api/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse } from "@/types/api";
import { Alert } from "react-native";

export async function fetchSignout(): Promise<any> {
  const memberId = useAuthStore.getState().memberInfo?.memberId;
  try {
    const response: ApiResponse<any> = await apiClient.delete("/members", {
      params: { memberId },
    });
    return response;
  } catch (error) {
    Alert.alert("회원탈퇴에 실패하였습니다. 다시시도해주세요.");
    return [];
  }
}
