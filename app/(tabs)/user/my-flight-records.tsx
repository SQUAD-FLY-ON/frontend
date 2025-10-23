import FlightCard from "@/conponents/(tabs)/user/my-flight-records/FlightCard";
import Header from "@/conponents/Header";
import { fetchFlightLogs } from "@/libs/(tabs)/user/fetchFlightLogs";
import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MyFlightRecords() {
  const memberId = useAuthStore((state) => state.memberInfo?.memberId);
  const pageSize = 10;
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["my-flight-logs", memberId],
      queryFn: ({ pageParam = 0 }) => {
        if (!memberId) {
          console.log("[my-flight-logs] memberId is empty!!!");
          return [];
        }
        return fetchFlightLogs({ memberId, page: pageParam, size: pageSize });
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length === 0) return undefined;

        if (lastPage.length < pageSize) return undefined;

        return allPages.length + 1;
      },
      initialPageParam: 0,
      enabled: !!memberId,
    });
  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerLoader}>
        <Text>더 많은 비행 기록을 불러오는 중...</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="비행 기록" backButton={true} />
      <FlatList
        style={{ marginVertical: 14 }}
        contentContainerStyle={styles.cardContainer}
        data={flatData}
        renderItem={({ item }) => (
          <FlightCard
            key={`${item.id}`} // id가 있다면 사용, 없으면 index
            id={item.id}
            name={item.airfieldName}
            date={item.createdAt}
            data={item}
          />
        )}
        keyExtractor={(item) => `${item.id}`}
        onEndReached={
          hasNextPage
            ? () => {
                fetchNextPage();
              }
            : undefined
        }
        onEndReachedThreshold={0.5} // 50% 지점에서 트리거
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    gap: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
});
