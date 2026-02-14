// /components/schedule/PlaceList.tsx
import { usePlaceList } from "@/hooks/schedule/usePlaceList";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";
import Filter from "../../Filter";
import TitleHeader from "../TitleHeader";
import PlaceCard from "./PlaceCard";

interface PlaceListProps {
  title: string;
  description: string;
}

export default function PlaceList({
  title,
  description,
}: PlaceListProps) {
  const flatListRef = useRef<FlatList>(null);

  const { selectedActivities } = useScheduleStore(
    useShallow(state => ({
      selectedActivities: state.selectedActivities,
    }))
  );

  const filters = [{ key: 'restaurant', text: '음식점' }, { key: 'attractions', text: '관광지' }];
  const [currentFilter, setCurrentFilter] = useState('restaurant');

  // currentFilter가 변경될 때마다 스크롤을 최상단으로
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [currentFilter]);
  const {
    flatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error
  } = usePlaceList(currentFilter, selectedActivities.latitude, selectedActivities.longitude);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          데이터를 불러오는 중 오류가 발생했습니다.
        </Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#666" />
        <Text style={styles.footerText}>더 많은 장소를 불러오는 중...</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TitleHeader title={title} description={description} style={{ marginBottom: 17 }} />
      <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} filters={filters} />
      <FlatList
        ref={flatListRef}
        style={{ marginVertical: 14 }}
        contentContainerStyle={styles.placeContainer}
        data={flatData}
        renderItem={({ item, index }) => (
          <PlaceCard
            key={`${item?.id || index}`}
            data={item}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>장소가 없습니다</Text>
          </View>
        }
        keyExtractor={(item, index) => `${item?.id || index}`}
        onEndReached={hasNextPage ? () => { fetchNextPage() } : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeContainer: {
    gap: 8,
    zIndex: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard-Regular'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Pretendard-bold'
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#ff4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});