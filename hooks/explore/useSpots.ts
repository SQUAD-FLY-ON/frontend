import { fetchSpots } from "@/libs/fetchSpots";
import { SpotRequest } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useSpots = (request: SpotRequest) => {
  return useQuery({
    queryKey: ["spots", request.sido, request.sigungu],
    queryFn: () => fetchSpots(request),
    staleTime: 1000 * 60 * 5,
    enabled: !!request.sido,
  });
};
