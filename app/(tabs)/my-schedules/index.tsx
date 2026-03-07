import TravelCard from "@/components/(tabs)/my-schedule/TravelCard/TravelCard";
import Header from "@/components/Header";
import { useTourSchedule } from "@/hooks/schedule/useTourSchedule";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function Index() {
  const { schedule, refetchSchedule } = useTourSchedule();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // 새로고침 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchSchedule(); // React Query에서 refetch 사용 (데이터 새로 불러오기)
    setRefreshing(false);
  }, [refetchSchedule]);
  useFocusEffect(
  useCallback(() => {
    refetchSchedule();
  }, [refetchSchedule])
);
  return (
    <View style={styles.container}>
      <Header title="나의 여행" backButton={false} />
      <FlatList
        data={schedule}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TravelCard onPress={() => { router.push(`/(tabs)/my-schedules/detail/${item.id}`) }} schedule={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#f7f7f7',
  },
  list: {
    flex: 1,
    width: '100%',
    marginTop: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom: 120,
  },
});
