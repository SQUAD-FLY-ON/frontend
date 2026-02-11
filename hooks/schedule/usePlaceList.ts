import { fetchAttractions, fetchRestaurants } from "@/libs/schedule/fetchTourism";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PAGE_SIZE = 10;

export const usePlaceList = (
  currentFilter: string,
  latitude: number,
  longitude: number,
) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfiniteQuery({
      queryKey: [currentFilter, latitude, longitude],
      queryFn: async ({ pageParam = 0 }) => {
        if (!latitude || !longitude) {
          return;
        }
        const params = { lat: latitude, lon: longitude, page: pageParam, size: PAGE_SIZE };
        if (currentFilter === "restaurant") {
          return await fetchRestaurants(params);
        } else {
          return await fetchAttractions(params);
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!latitude && !!longitude,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length === 0) return undefined;
        if (lastPage.length < PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
    });
  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);
  return { flatData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error };
};
