import { fetchWeather } from "@/libs/schedule/fetchWeather";
import { RegionName } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useWeather = (
  sido: string,
  tripStart: string,
  tripEnd: string,
) => {
  return useQuery({
    queryKey: ["weather", sido, tripStart, tripEnd],
    queryFn: () =>
      fetchWeather({
        sido: sido as RegionName,
        tripStart,
        tripEnd,
      }),
    staleTime: 1000 * 60 * 10,
    enabled: sido !== "",
  });
};
