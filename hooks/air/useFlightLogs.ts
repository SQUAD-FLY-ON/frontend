import { fetchFlightLogs } from "@/libs/(tabs)/user/fetchFlightLogs";
import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PAGE_SIZE = 10;

export const useFlightLogs = () => {
  const memberId = useAuthStore((state) => state.memberInfo?.memberId);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["my-flight-logs", memberId],
      queryFn: ({ pageParam = 0 }) => {
        if (!memberId) {
          return [];
        }
        return fetchFlightLogs({ memberId, page: pageParam, size: PAGE_SIZE });
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length === 0) return undefined;
        if (lastPage.length < PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
      initialPageParam: 0,
      enabled: !!memberId,
    });

  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return { flatData, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage };
};
