import { fetchMembers } from "@/libs/fetchMember";
import { MemberProfileInfo } from "@/types";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useMemberInfo = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["memberInfo"],
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5,
  });

  const memberInfo: MemberProfileInfo | null =
    data && !Array.isArray(data) ? (data as ApiResponse<MemberProfileInfo>).data : null;

  return { memberInfo, isLoading, isError, refetch };
};
