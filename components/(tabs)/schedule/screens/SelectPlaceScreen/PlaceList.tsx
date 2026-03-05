// /components/schedule/PlaceList.tsx
import { usePlaceList } from "@/hooks/schedule/usePlaceList";
import { useScheduleStore } from "@/store/useScheduleStore";
import { TourismItem } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const renderItem = useCallback(({ item }: { item: TourismItem }) => (
    <PlaceCard data={item} />
  ), []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#666" />
        <Text style={styles.footerText}>더 많은 장소를 불러오는 중...</Text>
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <View style={styles.flex1}>
      <TitleHeader title={title} description={description} style={styles.titleHeader} />
      <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} filters={filters} />
      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        contentContainerStyle={styles.placeContainer}
        data={flatData.filter((item): item is TourismItem => item !== undefined)}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>장소가 없습니다</Text>
          </View>
        }
        keyExtractor={(item) => `${item.name}-${item.fullAddress}`}
        onEndReached={hasNextPage ? () => { fetchNextPage() } : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  titleHeader: {
    marginBottom: 17,
  },
  flatList: {
    marginVertical: 14,
  },
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