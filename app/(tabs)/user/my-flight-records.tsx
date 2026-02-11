import FlightCard from "@/components/(tabs)/user/my-flight-records/FlightCard";
import Header from "@/components/Header";
import { useFlightLogs } from "@/hooks/air/useFlightLogs";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MyFlightRecords() {
  const { flatData, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFlightLogs();

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
