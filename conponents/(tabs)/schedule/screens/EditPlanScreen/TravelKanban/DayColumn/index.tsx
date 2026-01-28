import { Plan } from '@/types';
import React, { memo } from 'react';
import { View } from 'react-native';
import DayContent from './DayContent';
import DayHeader from './DayHeader';

interface DayData {
  title: string;
  plans: Plan[];
}

interface DayColumnProps {
  dayId: string;
  dayData: DayData;
  index: number;
  // ✅ draggingItem props 제거 - 더 이상 props drilling 안 함
  onLayoutDay: (dayId: string, event: any) => void;
  onLayoutCard: (dayId: string, index: number, event: any) => void;
  onDayRefSet: (dayId: string, ref: View | null) => void;
  onDragStart: (item: Plan, dayId: string, index: number, layout: any, position: any) => void;
  onDragMove: (x: number, y: number, gestureState: any, evt: any, initialPosition: any) => void;
  onDragEnd: (y: number) => void;
  styles: any;
}

// ✅ React.memo로 불필요한 리렌더링 차단
export const DayColumn = memo(({
  dayId,
  dayData,
  index,
  onLayoutDay,
  onLayoutCard,
  onDayRefSet,
  onDragStart,
  onDragMove,
  onDragEnd,
  styles,
}: DayColumnProps) => {
  if (!dayData) return null;

  return (
    <View
      style={[styles.dayColumn, index > 0 && styles.dayColumnSpacing]}
      onLayout={(event) => onLayoutDay(dayId, event)}
      ref={(ref) => onDayRefSet(dayId, ref)}
    >
      {/* Day 헤더 */}
      <DayHeader title={dayData.title} styles={styles} />

      {/* 계획 리스트 */}
      <DayContent
        dayId={dayId}
        plans={dayData.plans}
        onLayoutCard={onLayoutCard}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        styles={styles}
      />
    </View>
  );
});

