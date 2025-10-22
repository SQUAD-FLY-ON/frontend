// /components/schedule/PlaceList.tsx
import { fetchAttractions } from "@/libs/schedule/fetchAttractions";
import { fetchRestaurants } from "@/libs/schedule/fetchRestaurants";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
   const {  selectedActivities} = useScheduleStore(
    useShallow(state => ({ 
      selectedActivities: state.selectedActivities, 
      refreshSelectedPlaces: state.refreshSelectedPlaces 
    }))
  );

  const filters = [{key: 'restaurant', text: '음식점'}, {key: 'attractions', text:'관광지'}];
  const [currentFilter, setCurrentFilter] = useState('restaurant');
  const pageSize = 10;
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    error 
  } = useInfiniteQuery({
    queryKey: [currentFilter, selectedActivities.latitude, selectedActivities.longitude],
    queryFn: async ({ pageParam = 0 }) => {
      // if (pageParam === 0) {
      //   refreshSelectedPlaces();
      // }
      if(!selectedActivities.latitude || !selectedActivities.longitude ) {
        return;
      }
      console.log(pageParam);
      if (currentFilter === 'restaurant') {
        return await fetchRestaurants({ 
        lat: selectedActivities?.latitude, 
        lon: selectedActivities?.longitude, 
        page: pageParam,
        size: pageSize, 
        })
      } else {
        return await fetchAttractions({ 
        lat: selectedActivities?.latitude, 
        lon: selectedActivities?.longitude, 
        page: pageParam,
        size: pageSize, 
        })
      }
    },
    enabled: !!selectedActivities,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage);
      // // lastPage가 비어있거나 설정된 페이지 크기보다 작으면 다음 페이지 없음
      if (!lastPage || lastPage.length === 0) return undefined;
      
      if (lastPage.length < pageSize) return undefined;
      
      return allPages.length + 1;
    },
  });
  const flatData = useMemo(() => {
    return data?.pages.flatMap(page => page) || [];
  }, [data]);

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
      <TitleHeader title={title} description={description} style = {{marginBottom:17}}/>
      <Filter currentFilter = {currentFilter} setCurrentFilter = {setCurrentFilter} filters = {filters}/>
      <FlatList
        style={{ marginVertical: 14 }}
        contentContainerStyle={styles.placeContainer}
        data={flatData}
        renderItem={({ item, index }) => (
          <PlaceCard
            key={`${item.id || index}`} // id가 있다면 사용, 없으면 index
            data={item}
          />
        )}
        keyExtractor={(item, index) => `${item.id || index}`}
        onEndReached={hasNextPage ? () => {fetchNextPage()} : undefined}
        onEndReachedThreshold={0.5} // 50% 지점에서 트리거
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeContainer: {
    gap: 8,
    zIndex:1,
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
  }
});