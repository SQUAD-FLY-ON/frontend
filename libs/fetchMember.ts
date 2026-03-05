import { apiClient } from "@/api/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberResponse } from "@/types";
import { ApiResponse } from "@/types/api";
import { useModalStore } from "@/store/useModalStore";

export async function fetchMembers(): Promise<ApiResponse<MemberResponse> | []> {
  const memberId = useAuthStore.getState().memberInfo?.memberId;
  try {
    const response: ApiResponse<MemberResponse> = await apiClient.get(
      `/members?memberId=${memberId}`
    );
    return response;
  } catch {
    useModalStore.getState().showError({ title: "회원정보 조회에 실패하였습니다.", description: "다시 시도해주세요." });
    return [];
  }
}
