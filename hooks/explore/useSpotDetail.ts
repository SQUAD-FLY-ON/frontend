import { fetchSpotDetail } from "@/libs/(tabs)/explore/detail/fetchSpotDetail";
import { useQuery } from "@tanstack/react-query";

export const useSpotDetail = (spotId: string) => {
  return useQuery({
    queryKey: ["spotDetail", spotId],
    queryFn: () => fetchSpotDetail(spotId),
    staleTime: 1000 * 60 * 5,
    enabled: !!spotId,
  });
};
