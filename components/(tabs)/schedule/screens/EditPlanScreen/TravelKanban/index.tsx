import { useAutoScroll } from '@/hooks/dragAndDrop/useAutoScroll';
import { useDragDrop } from '@/hooks/dragAndDrop/useDragDrop';
import { useLayoutMeasurement } from '@/hooks/dragAndDrop/useLayoutMeasurement';
import { transformSchedulesToDayData } from '@/libs/schedule/transformSchedulesToDayData';
import { useScheduleStore } from '@/store/useScheduleStore';
import { GestureState, Plan } from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, ScrollView, StyleSheet, View } from 'react-native';
import { DayColumn } from './DayColumn';
import { FloatingPortalContext } from './FloatingPortal';

interface DayData {
  title: string;
  plans: Plan[];
}

interface DaysData {
  [dayId: string]: DayData;
}
export const TravelPlanKanban = () => {
  // ===== 1. 상태 관리 =====
  const [dayData, setDayData] = useState<DaysData>({});
  const schedule = useScheduleStore(state => state.schedule);
  // ===== 2. 자동 스크롤 훅 =====
  const {
    scrollViewRef,
    scrollOffsetRef,
    handleScroll,
    handleAutoScrollForDrag,
    stopAutoScroll,
  } = useAutoScroll({
    scrollSpeed: 15,
    threshold: 40,
  });

  // ===== 3. 레이아웃 측정 훅 =====
  const {
    scrollViewLayout,
    containerRef,
    dayRefs,
    measureScrollViewPosition,
    measureDay,
    measureCard,
    remeasureDayLayouts,
    getDropTarget,
  } = useLayoutMeasurement(scrollOffsetRef);

  // ===== 4. 드래그 앤 드롭 훅 =====
  // ✅ draggingItem은 이제 useDragStore에서 직접 구독 (props drilling 제거)
  const {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useDragDrop({
    scrollOffsetRef,
    measureScrollViewPosition,
    remeasureDayLayouts,
    getDropTarget,
    stopAutoScroll,
    FloatingPortalContext,
  });

  // ===== 5. 초기 데이터 로드 =====
  useEffect(() => {
    // 스케줄 데이터를 Day 형식으로 변환
    const transformedData = transformSchedulesToDayData(schedule);
    setDayData(transformedData);
  }, [schedule]);  // ✅ schedule 변경 시 dayData 업데이트

  // ===== 6. Day ref 관리 =====
  // ✅ useCallback으로 안정화
  const handleDayRefSet = useCallback((dayId: string, ref: View | null) => {
    if (ref) {
      dayRefs.current[dayId] = ref;
    }
  }, [dayRefs]);

  // ✅ useCallback으로 안정화 - scrollViewLayout을 ref로 참조
  const scrollViewLayoutRef = useRef(scrollViewLayout);
  scrollViewLayoutRef.current = scrollViewLayout;

  const handleEnhancedDragMove = useCallback((
    x: number,
    y: number,
    gestureState: GestureState,
    evt: GestureResponderEvent,
    initialPosition: { x: number; y: number }
  ) => {
    // 자동 스크롤 처리
    if (scrollViewLayoutRef.current.height) {
      handleAutoScrollForDrag(y, scrollViewLayoutRef.current);
    }

    // 드래그 이동 처리
    handleDragMove(x, y, gestureState, evt, initialPosition);
  }, [handleAutoScrollForDrag, handleDragMove]);

  // ✅ useCallback으로 안정화 - dayData를 ref로 참조
  const dayDataRef = useRef(dayData);
  dayDataRef.current = dayData;

  const handleEnhancedDragEnd = useCallback((y: number) => {
    handleDragEnd(y, dayDataRef.current, setDayData);
  }, [handleDragEnd]);

  return (
    <View ref={containerRef} style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {Object.entries(dayData).map(([dayId, data], index) => (
          <DayColumn
            key={dayId}
            dayId={dayId}
            dayData={data}
            index={index}
            onLayoutDay={measureDay}
            onLayoutCard={measureCard}
            onDayRefSet={handleDayRefSet}
            onDragStart={handleDragStart}
            onDragMove={handleEnhancedDragMove}
            onDragEnd={handleEnhancedDragEnd}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    position: 'relative',
  },
  dayColumn: {
    width: '100%',
  },
  dayColumnSpacing: {
    marginTop: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#1A202C',
  },
  dayContent: {
    paddingLeft: 12,
    marginBottom: 32,
  },
  emptyDayDropZone: {
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  emptyDayText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyDayDropZoneHighlight: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
});

export default TravelPlanKanban;