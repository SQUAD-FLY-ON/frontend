import { fetchSpotTrack } from "@/libs/(tabs)/explore/detail/fetchSpotTrack";
import { useQuery } from "@tanstack/react-query";

export const useSpotTrack = (spotId: string, memberId: string) => {
  return useQuery({
    queryKey: ["spotTrack", spotId, memberId],
    queryFn: () => fetchSpotTrack(spotId, memberId),
    enabled: !!spotId && !!memberId,
  });
};
