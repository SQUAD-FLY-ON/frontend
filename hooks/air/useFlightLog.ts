import { getFlightLog } from "@/store/flightLogStore";
import { useQuery } from "@tanstack/react-query";

export const useFlightLog = (flightId: string) => {
  return useQuery({
    queryKey: ["flightLog", flightId],
    queryFn: () => getFlightLog(flightId),
    enabled: !!flightId,
  });
};
