import { fetchRecommendSpots } from "@/libs/(tabs)/index/fetchRecommendSpots";
import { RecommendSpotCreteria } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useRecommendSpots = (
  criteria: RecommendSpotCreteria,
  latitude?: number,
  longitude?: number,
) => {
  return useQuery({
    queryKey: ["recommendSpots", criteria],
    queryFn: () =>
      fetchRecommendSpots({
        criteria,
        latitude: latitude!,
        longitude: longitude!,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: !!latitude && !!longitude,
  });
};
